#!/usr/bin/env node
/**
 * resolve-nested-skill.js
 *
 * Resolves a dotted skill name (e.g. "deploy.init", "auth.jwt") to its
 * file path and metadata. Supports parent fallback, wildcards, caching,
 * and @ref extraction from SKILL.md files.
 *
 * Resolution order:
 *   1. Exact match in registry → return file, metadata
 *   2. Parent fallback (walk right-to-left) → "deploy.static.x" → "deploy.static" → "deploy"
 *   3. Not found → null with suggestions
 *
 * Usage:
 *   node resolve-nested-skill.js <name>           # exact/parent resolution
 *   node resolve-nested-skill.js --wildcard <pfx>  # list children
 *   node resolve-nested-skill.js --parse <file>    # extract @refs
 *   node resolve-nested-skill.js --no-cache <name> # bypass cache
 *   node resolve-nested-skill.js --verbose <name>  # include content
 */

const fs = require('fs');
const path = require('path');

// --- Paths ---
const SCRIPT_DIR = __dirname;
const CONFIG_DIR = path.resolve(SCRIPT_DIR, '..');
const REGISTRY_PATH = path.resolve(CONFIG_DIR, 'skill-registry.json');
const CACHE_PATH = path.resolve(CONFIG_DIR, '.skill-cache.json');

const SKILL_ROOTS = [
  path.resolve(CONFIG_DIR, '..', '..', '.agents', 'skills'),
  path.resolve(CONFIG_DIR, 'skills'),
];

// --- Utilities ---
function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function getRegistryMtime() {
  try {
    return fs.statSync(REGISTRY_PATH).mtimeMs;
  } catch {
    return 0;
  }
}

// --- Cache ---
let _cache = null;

function loadCache() {
  if (_cache) return _cache;
  try {
    const raw = readJSON(CACHE_PATH);
    if (raw.registryMtime === getRegistryMtime()) {
      _cache = raw;
      return _cache;
    }
  } catch { /* cache miss or invalid */ }
  _cache = { registryMtime: 0, entries: {} };
  return _cache;
}

function saveCache() {
  if (!_cache) return;
  _cache.registryMtime = getRegistryMtime();
  fs.writeFileSync(CACHE_PATH, JSON.stringify(_cache, null, 2) + '\n', 'utf-8');
}

function cacheGet(key) {
  const c = loadCache();
  return c.entries[key] || null;
}

function cacheSet(key, value) {
  const c = loadCache();
  c.entries[key] = value;
  saveCache();
}

function cacheClear() {
  _cache = { registryMtime: 0, entries: {} };
  try { fs.unlinkSync(CACHE_PATH); } catch {}
}

// --- Registry access ---
function loadRegistry() {
  return readJSON(REGISTRY_PATH);
}

function findSkillFile(name, registry) {
  // Walk skill roots to find the actual file
  for (const root of SKILL_ROOTS) {
    const entry = registry.skills.find(s => s.name === name);
    if (!entry) continue;

    // Derive possible file paths from the dotted name
    const parts = name.split('.');
    const lastPart = parts[parts.length - 1];

    // Possible paths (relative to skill root):
    const candidates = [];
    const relPath = entry.source === '.agents/skills'
      ? path.relative(SKILL_ROOTS[0], path.join(SKILL_ROOTS[0], ...parts, 'SKILL.md'))
      : path.relative(SKILL_ROOTS[1], path.join(SKILL_ROOTS[1], ...parts, 'SKILL.md'));

    // Try: subdir/SKILL.md and subdir/SKILL-variant.md
    for (const root of SKILL_ROOTS) {
      if (entry.source === '.agents/skills' && root === SKILL_ROOTS[1]) continue;
      if (entry.source === '.config/opencode/skills' && root === SKILL_ROOTS[0]) continue;

      // (1) SKILL.md in a subdirectory matching the last segment
      const subdirPath = path.join(root, ...parts.slice(0, -1), lastPart, 'SKILL.md');
      candidates.push(subdirPath);

      // (2) SKILL-<variant>.md in the parent directory
      const variantPath = path.join(root, ...parts.slice(0, -1), `SKILL-${lastPart}.md`);
      candidates.push(variantPath);

      // (3) Direct path from registry (if it was stored)
      if (entry.path) {
        candidates.push(path.join(root, entry.path));
      }
    }

    for (const fp of [...new Set(candidates)]) {
      if (fs.existsSync(fp)) {
        return { filePath: fp, root, entry };
      }
    }
  }
  return null;
}

/**
 * Compute an edit-distance-based "did you mean?" suggestion list.
 */
function fuzzySuggestions(input, registry, max = 5) {
  const inputLower = input.toLowerCase();
  const scored = registry.skills
    .filter(s => s.status === 'active')
    .map(s => {
      const name = s.name.toLowerCase();
      let score = 0;
      if (name === inputLower) score = 1000;
      else if (name.startsWith(inputLower)) score = 500;
      else if (name.includes(inputLower)) score = 200;
      else if (inputLower.includes(name)) score = 100;

      // Dot-path overlap bonus
      const inputParts = inputLower.split('.');
      const nameParts = name.split('.');
      const overlap = inputParts.filter(p => nameParts.includes(p)).length;
      score += overlap * 50;

      // Shorter names rank higher when similar
      const lenDiff = Math.abs(name.length - inputLower.length);
      score -= lenDiff * 5;

      return { name: s.name, score, category: s.category };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max);

  // If no fuzzy matches, return top active skills as broad suggestions
  if (scored.length === 0) {
    return registry.skills
      .filter(s => s.status === 'active')
      .slice(0, max)
      .map(s => ({ name: s.name, score: 0, category: s.category }));
  }
  return scored;
}

/**
 * Resolve a skill name through the resolution pipeline.
 */
function resolve(name, options = {}) {
  const { useCache = true, includeContent = false, noFallback = false } = options;
  const normalized = name.toLowerCase().trim();

  // 1. Check cache
  if (useCache) {
    const cached = cacheGet(normalized);
    if (cached) return cached;
  }

  const registry = loadRegistry();
  const result = { found: false, name: normalized, path: null, source: null, category: null, priority: null, content: null, fallback: null, suggestions: [], expects: undefined, provides: undefined, 'depends-on': undefined };

  // 2. Phase 1 — Exact match in registry
  const exact = registry.skills.find(s => s.name.toLowerCase() === normalized);
  if (exact) {
    result.found = true;
    result.name = exact.name;
    result.category = exact.category;
    result.source = exact.source;
    result.priority = exact.priority;
    result.triggers = exact.triggers || [];
    result.expects = exact.expects || undefined;
    result.provides = exact.provides || undefined;
    result['depends-on'] = exact['depends-on'] || undefined;

    // Find file
    const fileInfo = findSkillFile(exact.name, registry);
    if (fileInfo) {
      result.path = fileInfo.filePath;
      result.sourceRoot = fileInfo.root;
      if (includeContent) {
        try {
          result.content = fs.readFileSync(fileInfo.filePath, 'utf-8');
        } catch {}
      }
    }

    // Find children (skills that start with this name + dot)
    result.children = registry.skills
      .filter(s => s.name.startsWith(exact.name + '.') && s.status === 'active')
      .map(s => ({ name: s.name, category: s.category }));

    if (useCache) cacheSet(normalized, result);
    return result;
  }

  // 3. Phase 2 — Parent fallback (walk right-to-left)
  if (!noFallback) {
    const parts = normalized.split('.');
    for (let i = parts.length - 1; i >= 1; i--) {
      const parentName = parts.slice(0, i).join('.');
      const parent = registry.skills.find(s => s.name.toLowerCase() === parentName);
      if (parent) {
        const parentResult = resolve(parent.name, { useCache, includeContent });
        if (parentResult.found) {
          result.found = true;
          result.name = parentResult.name;
          result.path = parentResult.path;
          result.source = parentResult.source;
          result.category = parentResult.category;
          result.priority = parentResult.priority;
          result.triggers = parentResult.triggers;
          result.content = parentResult.content;
          result.sourceRoot = parentResult.sourceRoot;
          result.children = parentResult.children;
          result.expects = parentResult.expects;
          result.provides = parentResult.provides;
          result['depends-on'] = parentResult['depends-on'];
          result.fallback = { original: normalized, resolvedTo: parent.name, missedPart: parts.slice(i).join('.') };
          if (useCache) cacheSet(normalized, result);
          return result;
        }
      }
    }
  }

  // 4. Phase 3 — Not found, return suggestions
  result.suggestions = fuzzySuggestions(normalized, registry);
  if (useCache) cacheSet(normalized, result);
  return result;
}

/**
 * Wildcard: return all direct children of a prefix.
 */
function resolveWildcard(prefix) {
  const clean = prefix.replace(/\.?\*$/, '');
  const registry = loadRegistry();
  const children = registry.skills
    .filter(s => {
      if (s.status !== 'active') return false;
      // Direct child: starts with prefix + "."
      const remainder = s.name.slice(clean.length + 1);
      return s.name.startsWith(clean + '.') && !remainder.includes('.');
    })
    .map(s => ({
      name: s.name,
      category: s.category,
      source: s.source,
      priority: s.priority,
      triggers: s.triggers || [],
      expects: s.expects || undefined,
      provides: s.provides || undefined,
      'depends-on': s['depends-on'] || undefined,
    }));

  // Also include grandchildren if they exist (deeper nesting)
  const allDescendants = registry.skills
    .filter(s => s.status === 'active' && s.name.startsWith(clean + '.'))
    .map(s => ({ name: s.name, category: s.category, source: s.source, priority: s.priority, expects: s.expects || undefined, provides: s.provides || undefined }));

  return {
    prefix: clean,
    directChildren: children,
    allDescendants,
    count: children.length,
    total: allDescendants.length,
  };
}

/**
 * Parse @name references from a skill file.
 */
function parseRefs(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return { error: `Cannot read file: ${filePath}`, refs: [] };
  }

  // Find @name patterns in markdown (but not in code blocks)
  // @name can be @foo.bar, @foo.bar.baz
  const refs = [];
  const lines = content.split('\n');
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track code blocks
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Find @ references
    // Match @word.word or @word (but not email addresses, URLs, or markdown links)
    const regex = /(?:^|[^`])(@[a-zA-Z][\w.-]+\w)(?![^\s()]*\))/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      const raw = match[1]; // includes @
      const name = raw.slice(1); // strip @
      if (name.includes('@')) continue; // skip email-like patterns (a@b.com)
      if (name.startsWith('http')) continue; // skip URLs
      // Skip email/domain names (e.g. @example.com, @sub.domain.org)
      // These have a pattern like: word.tld where tld is 2-6 alpha chars
      const parts = name.split('.');
      if (parts.length >= 2) {
        const last = parts[parts.length - 1];
        // If last part looks like a TLD and first part isn't a known skill prefix
        if (/^[a-z]{2,6}$/.test(last) && parts.length <= 3 && !last.includes('-')) {
          const withoutTld = parts.slice(0, -1).join('.');
          // Check if this exists in registry — if not, it's probably not a skill ref
          const reg = loadRegistry();
          const exists = reg.skills.some(s => s.name === withoutTld || s.name.startsWith(withoutTld + '.'));
          if (!exists) continue;
        }
      }

      // Resolve each ref
      const resolved = resolve(name, { useCache: true, includeContent: false, noFallback: false });

      refs.push({
        raw,
        name,
        line: i + 1,
        resolved: resolved.found ? { found: true, name: resolved.name, category: resolved.category, path: resolved.path } : { found: false, suggestions: resolved.suggestions.slice(0, 3) },
      });
    }
  }

  // Load all corresponding ref files for a complete picture
  return {
    file: filePath,
    refCount: refs.length,
    refs,
  };
}

/**
 * Resolve a skill's dependency chain recursively.
 *
 * @param {string} name - Skill name to resolve deps for
 * @param {object} options
 * @param {Set} visited - Track visited names for cycle detection
 * @param {Set} resolved - Accumulator for deduplicated results
 * @returns {{ skill: string, dependencies: string[], resolvedChain: object[], cycles: string[], missing: string[], totalResolved: number }}
 */
function resolveDependencies(name, options = {}, visited = new Set(), resolvedSet = new Set()) {
  const registry = loadRegistry();
  const result = {
    skill: name,
    dependencies: [],
    resolvedChain: [],
    cycles: [],
    missing: [],
    totalResolved: 0,
  };

  const entry = registry.skills.find(s => s.name === name);
  if (!entry) {
    result.missing.push(name);
    return result;
  }

  const deps = entry['depends-on'] || [];
  result.dependencies = [...deps];

  for (const depName of deps) {
    // Cycle detection
    if (visited.has(depName)) {
      result.cycles.push(depName);
      continue;
    }

    // Deduplication: already resolved
    if (resolvedSet.has(depName)) {
      continue;
    }

    // Mark as visited for cycle detection
    visited.add(depName);

    // Resolve the dependency in the registry
    const depEntry = registry.skills.find(s => s.name === depName);
    if (!depEntry) {
      result.missing.push(depName);
      visited.delete(depName);
      continue;
    }

    const depResolved = resolve(depName, { useCache: true });
    const chainItem = {
      name: depName,
      found: depResolved.found,
      category: depEntry.category,
      path: depResolved.path || null,
      priority: depEntry.priority,
    };
    result.resolvedChain.push(chainItem);
    resolvedSet.add(depName);

    // Recursively resolve transitive dependencies
    const transitive = resolveDependencies(depName, options, visited, resolvedSet);
    result.resolvedChain.push(...transitive.resolvedChain);
    result.cycles.push(...transitive.cycles);
    result.missing.push(...transitive.missing);

    visited.delete(depName);
  }

  // Deduplicate resolvedChain by name (first occurrence wins = DFS order)
  const seen = new Set();
  result.resolvedChain = result.resolvedChain.filter(item => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });

  result.cycles = [...new Set(result.cycles)];
  result.missing = [...new Set(result.missing)];
  result.totalResolved = result.resolvedChain.length;

  return result;
}

/**
 * Build a dependency tree structure for visualization.
 */
function resolveDependencyTree(name, visited = new Set(), depth = 0) {
  const registry = loadRegistry();
  const entry = registry.skills.find(s => s.name === name);
  if (!entry) return { name, exists: false, children: [] };

  const deps = entry['depends-on'] || [];
  const children = [];

  for (const depName of deps) {
    if (visited.has(depName)) {
      children.push({ name: depName, exists: true, cycle: true, children: [] });
      continue;
    }
    visited.add(depName);
    children.push(resolveDependencyTree(depName, visited, depth + 1));
  }

  return { name, exists: true, category: entry.category, children };
}

/**
 * Render a dependency tree as an indented string.
 */
function renderTree(node, prefix = '', isLast = true, isRoot = true) {
  const lines = [];
  if (isRoot) {
    lines.push(`${node.name}${node.cycle ? ' (cycle!)' : ''}`);
  } else {
    const connector = isLast ? '└─ ' : '├─ ';
    const label = node.exists
      ? node.name + (node.cycle ? ' (cycle!)' : '')
      : `${node.name} (not found)`;
    lines.push(`${prefix}${connector}${label}`);
  }

  const children = node.children || [];
  for (let i = 0; i < children.length; i++) {
    const childPrefix = isRoot ? '' : prefix + (isLast ? '   ' : '│  ');
    const childLines = renderTree(children[i], childPrefix, i === children.length - 1, false);
    lines.push(...childLines);
  }

  return lines;
}

// --- CLI ---
function main() {
  const args = process.argv.slice(2);
  const flags = {
    wildcard: false,
    parse: false,
    depends: false,
    dependsTree: false,
    noCache: false,
    verbose: false,
    clearCache: false,
  };

  // Parse flags
  const positional = [];
  for (const arg of args) {
    switch (arg) {
      case '--wildcard': flags.wildcard = true; break;
      case '--depends': flags.depends = true; break;
      case '--depends-tree':
      case '--dependsTree': flags.dependsTree = true; break;
      case '--no-cache':
      case '--noCache': flags.noCache = true; break;
      case '--verbose': flags.verbose = true; break;
      case '--clear-cache':
      case '--clearCache': flags.clearCache = true; break;
      default:
        if (arg === '--parse') { flags.parse = true; }
        else { positional.push(arg); }
    }
  }

  if (flags.clearCache) {
    cacheClear();
    console.log(JSON.stringify({ ok: true, action: 'cache-cleared' }, null, 2));
    return;
  }

  const options = { useCache: !flags.noCache, includeContent: flags.verbose };

  // --parse <file>
  if (flags.parse) {
    const target = positional[0];
    if (!target) {
      console.error('Usage: resolve-nested-skill.js --parse <file>');
      process.exit(1);
    }
    const result = parseRefs(target);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // --wildcard <prefix>
  if (flags.wildcard) {
    const prefix = positional[0] || '';
    const result = resolveWildcard(prefix);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // --depends <name> (resolve dependency chain)
  if (flags.depends) {
    const target = positional[0];
    if (!target) {
      console.error('Usage: resolve-nested-skill.js --depends <name>');
      process.exit(1);
    }
    const result = resolveDependencies(target);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // --depends-tree <name> (visualize dependency tree)
  if (flags.dependsTree) {
    const target = positional[0];
    if (!target) {
      console.error('Usage: resolve-nested-skill.js --depends-tree <name>');
      process.exit(1);
    }
    const tree = resolveDependencyTree(target);
    const output = renderTree(tree).join('\n');
    console.log(output);
    return;
  }

  // <name> (exact/parent fallback)
  const name = positional[0];
  if (!name) {
    console.error('Usage: resolve-nested-skill.js [--wildcard|--parse|<name>] [--no-cache] [--verbose]');
    process.exit(1);
  }

  const result = resolve(name, options);
  console.log(JSON.stringify(result, null, 2));
}

main();
