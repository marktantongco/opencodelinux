#!/usr/bin/env node
/**
 * scan-nested-skills.js
 *
 * Recursively discovers SKILL*.md files and updates skill-registry.json.
 *
 * Phases 1-3: Variants, dot-path names, depends-on parsing.
 * Phase 4:     _auto tagging, --refresh, --prune, expects/provides.
 *
 * Usage:
 *   node scan-nested-skills.js                    # add new skills only
 *   node scan-nested-skills.js --refresh          # sync auto entries from source
 *   node scan-nested-skills.js --prune            # remove orphaned auto entries
 *   node scan-nested-skills.js --dry-run          # preview only
 */

const fs = require('fs');
const path = require('path');

const SKILL_DIRS = [
  path.resolve(__dirname, '..', '..', '..', '.agents', 'skills'),
  path.resolve(__dirname, '..', 'skills'),  // .config/opencode/skills
];
const REGISTRY_PATH = path.resolve(__dirname, '..', 'skill-registry.json');

// ── Frontmatter Parser ──────────────────────────────────────────────

/**
 * Parse YAML frontmatter into key-value pairs, lists, and structured objects.
 *
 * Supported:
 *   key: value                 → scalar
 *   key: [a, b, c]             → inline list
 *   key:\n  - a\n  - b         → block list
 *   key:\n  - sub: val\n  ...  → structured object array
 */
function parseFrontmatter(text) {
  const lines = text.split('\n');
  if (!lines[0] || !lines[0].startsWith('---')) return {};

  let end = 1;
  while (end < lines.length && !lines[end].startsWith('---')) end++;
  if (end >= lines.length) return {};

  const fm = {};
  let activeKey = null;       // for block-list collection
  let activeList = null;      // current block list being built
  let activeObjects = null;   // for structured object arrays (expects/provides)
  let currentObj = null;      // object being built inside a structured list
  let keyFromLine = null;     // key of current block starter line (for structured objects)
  let activeBlockScalar = null; // key name when inside a > folded block scalar

  for (let i = 1; i < end; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = line.length - line.trimStart().length;

    if (!trimmed || trimmed.startsWith('#')) {
      // End of active block context
      if (activeBlockScalar) {
        // Don't clear block scalar on empty/comment lines — keep collecting
        continue;
      }
      if (activeObjects && currentObj) {
        activeObjects.push(currentObj);
        currentObj = null;
      }
      if (activeList && !trimmed.startsWith('-') && activeList.length > 0) {
        fm[activeKey] = [...new Set(activeList)];
        activeList = null;
        activeKey = null;
      } else if (activeList && !trimmed.startsWith('-')) {
        activeList = null;
      }
      continue;
    }

    // ── Folded block scalar continuation (indented lines after key: >) ──
    if (activeBlockScalar) {
      if (indent > 0) {
        // Continuation line — fold into existing value
        const prev = fm[activeBlockScalar] || '';
        fm[activeBlockScalar] = prev + (prev ? ' ' : '') + trimmed;
        continue;
      } else {
        // Non-indented line ends the block scalar, but don't clear yet
        // Let it fall through to colon/list/key-value logic below
        activeBlockScalar = null;
      }
    }

    // ── List items (must check BEFORE colon, since - key: val has a colon) ──
    if (trimmed.startsWith('- ')) {
      const content = trimmed.slice(2).trim();
      const itemColon = content.indexOf(':');

      // Check if this is a structured object (has sub-keys on next line)
      const nextLine = lines[i + 1];
      const hasSubKeys = nextLine && nextLine.length > 2 && nextLine.includes(':') && 
        (nextLine.length - nextLine.trimStart().length) > indent + 1;

      if (hasSubKeys && itemColon !== -1) {
        // Structured object: - key: val  followed by indented sub-keys
        if (!activeObjects) {
          activeObjects = [];
          activeKey = activeKey || keyFromLine || 'list';
          activeList = null;   // clear any stale empty activeList (avoids overwrite in finalize)
        }
        if (currentObj) activeObjects.push(currentObj);
        const itemKey = content.slice(0, itemColon).trim();
        const itemVal = content.slice(itemColon + 1).trim().replace(/^["']|["']$/g, '');
        currentObj = { key: itemKey };
        if (itemVal) currentObj[itemKey] = itemVal;
        continue;
      }

      // Plain list item (just - value, or - key: val without sub-keys)
      if (activeKey) {
        activeList.push(content.replace(/^["']|["']$/g, ''));
        continue;
      }

      // Not in list context → treat as stray (continue)
      continue;
    }

    // ── Non-list lines with colon ──
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();

      // If we're inside a structured object and this line has deeper indent
      if (activeObjects && currentObj && indent >= 2) {
        // Sub-key of current object
        if (val === '' || val.startsWith('>') || val.startsWith('|')) {
          // Could be a multi-line value — for now skip
        } else {
          currentObj[key] = val.replace(/^["']|["']$/g, '');
        }
        continue;
      }

      // Finalize any previous block context
      if (activeObjects) {
        if (currentObj) activeObjects.push(currentObj);
        fm[activeKey] = activeObjects;
        activeObjects = null;
        currentObj = null;
      }
      if (activeList && activeList.length > 0) {
        fm[activeKey] = [...new Set(activeList)];
        activeList = null;
        activeKey = null;
      } else if (activeList) {
        // empty list — just clear state
        activeList = null;
      }

      // Inline list: [a, b, c]
      if (val.startsWith('[') && val.endsWith(']')) {
        fm[key] = val.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
        continue;
      }

      // Folded block scalar: key: >
      if (val === '>' || val.startsWith('> ')) {
        activeBlockScalar = key;
        fm[key] = '';
        continue;
      }

      // Literal block scalar (|)
      if (val.startsWith('|')) continue;

      // Block list starter: key: (with nothing after colon)
      if (val === '') {
        activeKey = key;
        keyFromLine = key;
        activeList = [];
        activeObjects = null;
        continue;
      }

      // Scalar value
      fm[key] = val.replace(/^["']|["']$/g, '');
      continue;
    }

    // ── Lines with no colon and not list items → end of block context ──
    if (activeObjects && currentObj) {
      activeObjects.push(currentObj);
      currentObj = null;
    }
    if (activeList && activeList.length > 0) {
      fm[activeKey] = [...new Set(activeList)];
      activeList = null;
      activeKey = null;
    } else if (activeList) {
      activeList = null;
    }
  }

  // Finalize any trailing block context
  if (activeObjects) {
    if (currentObj) activeObjects.push(currentObj);
    if (activeKey) fm[activeKey] = activeObjects;
  }
  if (activeList && activeList.length > 0) {
    fm[activeKey] = [...new Set(activeList)];
  }

  return fm;
}

// ── File Discovery ──────────────────────────────────────────────────

function findFiles(dir, pattern) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        results.push(...findFiles(fullPath, pattern));
      }
    } else if (entry.isFile() && pattern.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Name Derivation ─────────────────────────────────────────────────

function deriveName(filePath, baseDir) {
  const relative = path.relative(baseDir, filePath).replace(/\\/g, '/');
  const parts = relative.replace(/\.md$/i, '').split('/');
  const skillIdx = parts.findIndex(p => p === 'SKILL' || p.startsWith('SKILL-'));
  if (skillIdx === -1) return parts.join('.');
  const dirParts = parts.slice(0, skillIdx);
  const skillPart = parts[skillIdx];
  if (skillPart === 'SKILL') return dirParts.join('.') || path.basename(baseDir);
  const variant = skillPart.replace('SKILL-', '');
  return [...dirParts, variant].join('.');
}

// ── Scanning ────────────────────────────────────────────────────────

function scanSkills() {
  const discovered = [];
  for (const dir of SKILL_DIRS) {
    if (!fs.existsSync(dir)) {
      console.warn(`[warn] Skill directory not found: ${dir}`);
      continue;
    }
    const files = findFiles(dir, /^SKILL.*\.md$/);
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const frontmatter = parseFrontmatter(content);
      const name = frontmatter.name || deriveName(filePath, dir);
      const isNested = name.includes('.');
      const relPath = path.relative(dir, filePath);

      discovered.push({
        name,
        path: relPath,
        source: dir.includes('.agents') ? '.agents/skills' : '.config/opencode/skills',
        isNested,
        description: frontmatter.description || '',
        dependencies: frontmatter['depends-on'] || [],
        expects: frontmatter.expects || [],
        provides: frontmatter.provides || [],
      });
    }
  }
  return discovered;
}

// ── Registry Update ─────────────────────────────────────────────────

function updateRegistry(discovered, options) {
  const { dryRun = false, refresh = false, prune = false } = options;
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  const existingNames = new Set(registry.skills.map(s => s.name));
  const added = [];
  const depsUpdated = [];
  const refreshed = [];
  const pruned = [];

  // Build lookup of discovered skills by name
  const discoveredMap = new Map(discovered.map(s => [s.name, s]));

  for (const skill of discovered) {
    const existingIdx = registry.skills.findIndex(s => s.name === skill.name);

    if (existingIdx !== -1) {
      const existing = registry.skills[existingIdx];
      const isAuto = existing._auto === true;

      // --- Manual entries: only sync depends-on from file ---
      if (!isAuto) {
        // If --refresh, auto-tag this entry since it matches a discovered file
        if (refresh) {
          existing._auto = true;
          // Now treat as auto entry below — fall through
        } else {
          const oldDeps = JSON.stringify(existing['depends-on'] || []);
          const newDeps = JSON.stringify(skill.dependencies);
          if (oldDeps !== newDeps) {
            existing['depends-on'] = skill.dependencies.length > 0 ? skill.dependencies : undefined;
            depsUpdated.push(skill.name);
          }
          continue;
        }
      }

      // --- Auto entries: sync only when --refresh is active ---
      if (refresh || isAuto) {
        let changed = false;

        // Sync description
        if (skill.description && existing.description !== skill.description) {
          existing.description = skill.description;
          changed = true;
        }

        // Sync depends-on
        const oldDeps = JSON.stringify(existing['depends-on'] || []);
        const newDeps = JSON.stringify(skill.dependencies);
        if (oldDeps !== newDeps) {
          existing['depends-on'] = skill.dependencies.length > 0 ? skill.dependencies : undefined;
          changed = true;
        }

        // Sync expects
        const oldExpects = JSON.stringify(existing.expects || []);
        const newExpects = JSON.stringify(skill.expects);
        if (oldExpects !== newExpects) {
          existing.expects = skill.expects.length > 0 ? skill.expects : undefined;
          changed = true;
        }

        // Sync provides
        const oldProvides = JSON.stringify(existing.provides || []);
        const newProvides = JSON.stringify(skill.provides);
        if (oldProvides !== newProvides) {
          existing.provides = skill.provides.length > 0 ? skill.provides : undefined;
          changed = true;
        }

        // Sync path
        if (skill.path) {
          existing.path = skill.path;
        }

        if (changed) refreshed.push(skill.name);
      }

      continue;  // already registered, handled above
    }

    // ── New entry ──
    let category = 'workflow-process';
    let triggers = [];
    let priority = 3;

    if (skill.isNested) {
      const parentName = skill.name.split('.').slice(0, -1).join('.');
      const parent = registry.skills.find(s => s.name === parentName);
      if (parent) {
        category = parent.category || category;
        triggers = parent.triggers ? parent.triggers.map(t => `${t} ${skill.name.split('.').pop()}`) : [];
        priority = parent.priority || priority;
      }
    }

    const entry = {
      name: skill.name,
      category,
      source: skill.source,
      status: 'active',
      priority,
      _auto: true,
      triggers: triggers.length > 0 ? triggers : [`${skill.name.split('.').pop()}`],
    };

    // Optional fields
    if (skill.description) entry.description = skill.description;
    if (skill.dependencies.length > 0) entry['depends-on'] = skill.dependencies;
    if (skill.expects.length > 0) entry.expects = skill.expects;
    if (skill.provides.length > 0) entry.provides = skill.provides;
    if (skill.path) entry.path = skill.path;

    registry.skills.push(entry);
    existingNames.add(skill.name);
    added.push(skill.name);
  }

  // ── Prune: remove auto entries whose source file no longer exists ──
  if (prune) {
    const toRemove = [];
    for (const entry of registry.skills) {
      if (entry._auto !== true) continue;
      if (!discoveredMap.has(entry.name)) {
        toRemove.push(entry.name);
      }
    }
    registry.skills = registry.skills.filter(s => !toRemove.includes(s.name));
    pruned.push(...toRemove);
  }

  // Sort by name
  registry.skills.sort((a, b) => a.name.localeCompare(b.name));

  // ── Report ──
  if (dryRun) {
    if (added.length > 0) {
      console.log(`[DRY RUN] Would add ${added.length} new skill(s):`);
      added.forEach(n => console.log(`  + ${n}`));
    }
    if (refreshed.length > 0) {
      console.log(`[DRY RUN] Would refresh ${refreshed.length} auto entry/entries:`);
      refreshed.forEach(n => console.log(`  ~ ${n}`));
    }
    if (depsUpdated.length > 0) {
      console.log(`[DRY RUN] Would sync depends-on for ${depsUpdated.length} manual entry/entries:`);
      depsUpdated.forEach(n => console.log(`  ~ ${n}`));
    }
    if (pruned.length > 0) {
      console.log(`[DRY RUN] Would prune ${pruned.length} orphaned auto entry/entries:`);
      pruned.forEach(n => console.log(`  - ${n}`));
    }
    if (added.length === 0 && refreshed.length === 0 && depsUpdated.length === 0 && pruned.length === 0) {
      console.log('[DRY RUN] No changes needed.');
    }
    return;
  }

  // Write
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n', 'utf-8');
  if (added.length > 0) console.log(`Added ${added.length} new skill(s):`);
  added.forEach(n => console.log(`  + ${n}`));
  if (refreshed.length > 0) console.log(`\nRefreshed ${refreshed.length} auto entry/entries:`);
  refreshed.forEach(n => console.log(`  ~ ${n}`));
  if (depsUpdated.length > 0) console.log(`\nSynced depends-on for ${depsUpdated.length} manual entry/entries:`);
  depsUpdated.forEach(n => console.log(`  ~ ${n}`));
  if (pruned.length > 0) console.log(`\nPruned ${pruned.length} orphaned auto entry/entries:`);
  pruned.forEach(n => console.log(`  - ${n}`));
  if (added.length === 0 && refreshed.length === 0 && depsUpdated.length === 0 && pruned.length === 0) {
    console.log('No changes needed.');
  }
}

// ── CLI ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flags = {
  dryRun: args.includes('--dry-run'),
  refresh: args.includes('--refresh'),
  prune: args.includes('--prune'),
};

console.log(`Scanning for nested skills (refresh: ${flags.refresh}, prune: ${flags.prune}, dry-run: ${flags.dryRun})...\n`);

const skills = scanSkills();
console.log(`Found ${skills.length} total skill file(s)`);
console.log(`  ${skills.filter(s => s.isNested).length} nested/variant(s)`);
console.log(`  ${skills.filter(s => s.expects.length > 0).length} with expects`);
console.log(`  ${skills.filter(s => s.provides.length > 0).length} with provides\n`);

updateRegistry(skills, flags);

if (!flags.dryRun) {
  console.log('\nDone. Run with --dry-run to preview without writing.');
}
