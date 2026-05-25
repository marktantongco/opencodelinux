#!/usr/bin/env node
/**
 * add-expects-provides.js
 *
 * Adds `expects` and `provides` structured I/O frontmatter to all SKILL*.md
 * files that don't already have them. Uses category-based templates.
 *
 * Usage: node add-expects-provides.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.resolve(__dirname, '..');
const SKILL_ROOTS = [
  path.resolve(CONFIG_DIR, '..', '..', '.agents', 'skills'),
  path.resolve(CONFIG_DIR, 'skills'),
];

const REGISTRY_PATH = path.resolve(CONFIG_DIR, 'skill-registry.json');
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));

const dryRun = process.argv.includes('--dry-run');

// ── Category-based I/O templates ──
// Each template can include $name, $desc substitutions
const CATEGORY_TEMPLATES = {
  'ai-content': {
    expects: [
      { key: 'prompt', type: 'string', description: 'Description of the content to generate', default: '' },
      { key: 'model', type: 'string', description: 'AI model to use', default: 'auto' },
      { key: 'style', type: 'string', description: 'Visual or creative style', default: '' },
    ],
    provides: [
      { key: 'output_url', type: 'url', description: 'URL to the generated output' },
      { key: 'file_path', type: 'path', description: 'Local path to the generated file' },
    ],
  },
  'dev-engineering': {
    expects: [
      { key: 'input', type: 'string', description: 'Source code or data to process' },
      { key: 'options', type: 'object', description: 'Configuration options', default: '' },
    ],
    provides: [
      { key: 'result', type: 'string', description: 'Processed output or generated code' },
      { key: 'file_path', type: 'path', description: 'Path to any generated files' },
    ],
  },
  'workflow-process': {
    expects: [
      { key: 'context', type: 'string', description: 'Current context and state information' },
      { key: 'input', type: 'string', description: 'Input data or content to process' },
    ],
    provides: [
      { key: 'output', type: 'string', description: 'Processed output or result' },
      { key: 'report', type: 'string', description: 'Summary or report of what was done' },
    ],
  },
  'meta-system': {
    expects: [
      { key: 'input', type: 'string', description: 'Input content or instructions' },
    ],
    provides: [
      { key: 'output', type: 'string', description: 'Generated output' },
    ],
  },
  'marketing-comms': {
    expects: [
      { key: 'topic', type: 'string', description: 'Topic or subject matter' },
      { key: 'audience', type: 'string', description: 'Target audience', default: 'general' },
      { key: 'tone', type: 'string', description: 'Writing tone', default: 'professional' },
    ],
    provides: [
      { key: 'content', type: 'string', description: 'Generated written content' },
      { key: 'file_path', type: 'path', description: 'Path to the output file' },
    ],
  },
  'ui-design': {
    expects: [
      { key: 'description', type: 'string', description: 'Design requirements description' },
      { key: 'platform', type: 'string', description: 'Target platform', default: 'web' },
      { key: 'style', type: 'string', description: 'Visual style direction', default: '' },
    ],
    provides: [
      { key: 'design_output', type: 'string', description: 'Generated design code or description' },
      { key: 'file_path', type: 'path', description: 'Path to generated design files' },
    ],
  },
  'research-knowledge': {
    expects: [
      { key: 'query', type: 'string', description: 'Research question or search query' },
    ],
    provides: [
      { key: 'findings', type: 'string', description: 'Research findings and analysis' },
      { key: 'references', type: 'array', description: 'List of references or sources' },
    ],
  },
  'infrastructure': {
    expects: [
      { key: 'config', type: 'string', description: 'Configuration or settings to apply' },
      { key: 'environment', type: 'string', description: 'Target environment', default: 'production' },
    ],
    provides: [
      { key: 'status', type: 'string', description: 'Operation status or result' },
      { key: 'deployment_url', type: 'url', description: 'URL of the deployed resource' },
    ],
  },
};

// Default template for any category not listed above
const DEFAULT_TEMPLATE = {
  expects: [
    { key: 'input', type: 'string', description: 'Input data or instructions' },
  ],
  provides: [
    { key: 'output', type: 'string', description: 'Result or generated output' },
  ],
};

// ── Custom overrides for specific skills ──
const SKILL_OVERRIDES = {
  'fullstack-dev': null,  // already has expects/provides
  'fullstack-pro': null,  // already has expects/provides
  'agent-browser': {
    expects: [
      { key: 'url', type: 'url', description: 'URL to navigate to' },
      { key: 'action', type: 'string', description: 'Browser action to perform (navigate, click, fill, screenshot, etc.)' },
    ],
    provides: [
      { key: 'page_content', type: 'string', description: 'Page content or extracted data' },
      { key: 'screenshot', type: 'string', description: 'Screenshot of the page, if taken' },
    ],
  },
  'deploy.init': {
    expects: [
      { key: 'project_path', type: 'path', description: 'Path to the project to deploy' },
      { key: 'platform', type: 'string', description: 'Deployment platform', default: 'auto' },
    ],
    provides: [
      { key: 'deploy_config', type: 'path', description: 'Generated deployment configuration path' },
    ],
  },
  'deploy.rollback': {
    expects: [
      { key: 'deployment_id', type: 'string', description: 'ID of the deployment to rollback' },
      { key: 'version', type: 'string', description: 'Target version to rollback to', default: '' },
    ],
    provides: [
      { key: 'status', type: 'string', description: 'Rollback operation status' },
    ],
  },
  'deploy.status': {
    expects: [
      { key: 'deployment_id', type: 'string', description: 'ID of the deployment to check', default: '' },
    ],
    provides: [
      { key: 'status', type: 'string', description: 'Current deployment status and details' },
      { key: 'history', type: 'array', description: 'Recent deployment history' },
    ],
  },
  'analyse-codebase': {
    expects: [
      { key: 'codebase_path', type: 'path', description: 'Path to the codebase to analyze' },
      { key: 'analysis_type', type: 'string', description: 'Type of analysis to perform', default: 'comprehensive' },
    ],
    provides: [
      { key: 'report', type: 'string', description: 'Analysis report with findings' },
      { key: 'metrics', type: 'object', description: 'Code quality and complexity metrics' },
    ],
  },
};

// ── Helper: format a YAML list of structured objects ──
function formatExpectsProvides(items, indent = 0) {
  const pad = ' '.repeat(indent);
  const lines = [];
  for (const item of items) {
    lines.push(`${pad}- key: ${item.key}`);
    lines.push(`${pad}  type: ${item.type}`);
    if (item.description) {
      lines.push(`${pad}  description: ${item.description}`);
    }
    if (item.default !== undefined && item.default !== '') {
      lines.push(`${pad}  default: ${item.default}`);
    }
  }
  return lines.join('\n');
}

// ── Find all SKILL*.md files ──
function findSkillFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findSkillFiles(fullPath));
    } else if (entry.isFile() && entry.name.startsWith('SKILL') && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Get category from registry ──
function getCategory(name) {
  const entry = registry.skills.find(s => s.name === name);
  return entry ? entry.category : null;
}

// ── Main ──
function main() {
  let allFiles = [];
  for (const root of SKILL_ROOTS) {
    allFiles = allFiles.concat(findSkillFiles(root));
  }
  // Deduplicate
  allFiles = [...new Set(allFiles)];
  allFiles.sort();

  console.log(`Found ${allFiles.length} skill file(s)`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of allFiles) {
    const relPath = path.relative(path.resolve(CONFIG_DIR, '..', '..'), filePath);
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
      console.error(`  [ERR] Cannot read ${relPath}: ${e.message}`);
      errors++;
      continue;
    }

    // Parse frontmatter
    const lines = content.split('\n');
    if (lines.length < 2 || !lines[0].startsWith('---')) {
      console.error(`  [ERR] ${relPath}: No frontmatter (no opening ---)`);
      errors++;
      continue;
    }

    let endIdx = 1;
    while (endIdx < lines.length && !lines[endIdx].startsWith('---')) endIdx++;
    if (endIdx >= lines.length) {
      console.error(`  [ERR] ${relPath}: No closing --- in frontmatter`);
      errors++;
      continue;
    }

    const fmLines = lines.slice(1, endIdx);
    const fmText = fmLines.join('\n');
    const bodyLines = lines.slice(endIdx + 1);

    // Quick check: already has expects AND provides with content
    const hasExpects = fmText.includes('expects:') || fmText.includes('\nexpects:');
    const hasProvides = fmText.includes('provides:') || fmText.includes('\nprovides:');

    // Parse name from frontmatter for registry lookup
    let name = null;
    for (const l of fmLines) {
      const m = l.match(/^name:\s*(.+)/);
      if (m) { name = m[1].trim(); break; }
    }

    // Check if already has non-empty expects/provides from registry
    if (name) {
      const entry = registry.skills.find(s => s.name === name);
      if (entry && entry.expects && entry.expects.length > 0 && entry.provides && entry.provides.length > 0) {
        skipped++;
        continue;
      }
    }

    // Get category and template
    const category = name ? getCategory(name) : null;
    let tmpl = null;

    // Check for skill-specific override
    if (name && SKILL_OVERRIDES[name] === null) {
      // Explicitly marked as "no override needed" (already has expects/provides)
      skipped++;
      continue;
    }
    if (name && SKILL_OVERRIDES[name]) {
      tmpl = SKILL_OVERRIDES[name];
    } else if (category && CATEGORY_TEMPLATES[category]) {
      tmpl = CATEGORY_TEMPLATES[category];
    } else {
      tmpl = DEFAULT_TEMPLATE;
    }

    // Build expects/provides YAML block
    const expectsYaml = formatExpectsProvides(tmpl.expects, 0);
    const providesYaml = formatExpectsProvides(tmpl.provides, 0);
    const block = `expects:\n${expectsYaml}\nprovides:\n${providesYaml}`;

    // Insert before closing ---
    // Find a good insertion point: after last non-empty YAML line, before ---
    // We insert after the last line that has content before '---'
    const newFmLines = [...fmLines];
    // Remove trailing empty lines
    while (newFmLines.length > 0 && newFmLines[newFmLines.length - 1].trim() === '') {
      newFmLines.pop();
    }
    newFmLines.push('');
    newFmLines.push(...block.split('\n'));

    const newContent = lines[0] + '\n' + newFmLines.join('\n') + '\n---\n' + bodyLines.join('\n');

    if (dryRun) {
      console.log(`  [DRY] ${relPath} (category: ${category || 'unknown'})`);
    } else {
      try {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`  [OK]  ${relPath}`);
      } catch (e) {
        console.error(`  [ERR] ${relPath}: Write error: ${e.message}`);
        errors++;
        continue;
      }
    }
    updated++;
  }

  console.log(`\nDone. ${updated} updated, ${skipped} skipped, ${errors} errors.`);
  if (dryRun) {
    console.log('Dry run — no files were written. Run without --dry-run to apply.');
  }
}

main();
