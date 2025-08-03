#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔄 Generating registry index...');

const registryDir = join(rootDir, 'apps', 'docs', 'public', 'registry');
const packagesDir = join(rootDir, 'packages');

if (!existsSync(registryDir)) {
  console.error('❌ Registry directory not found. Run generate:component first.');
  process.exit(1);
}

// Get all registry files
const registryFiles = readdirSync(registryDir)
  .filter(file => file.endsWith('.json') && file !== 'index.json')
  .map(file => file.replace('.json', ''));

console.log(`📦 Found ${registryFiles.length} components in registry`);

// Generate registry index
const registryIndex = {
  name: 'devcn-ui',
  description: 'Devcn UI Design Registry - Beautiful, accessible components built with React and Tailwind CSS',
  url: 'https://devcn-ui.dedevs.com',
  components: []
};

// Process each component
for (const componentName of registryFiles) {
  try {
    const registryPath = join(registryDir, `${componentName}.json`);
    const componentData = JSON.parse(readFileSync(registryPath, 'utf8'));

    // Validate component data
    if (!componentData.name || !componentData.files) {
      console.warn(`⚠️  Skipping invalid component: ${componentName}`);
      continue;
    }

    // Add to index
    registryIndex.components.push({
      name: componentData.name,
      type: componentData.type || 'registry:ui',
      description: componentData.description || `${componentData.name} component`,
      dependencies: componentData.dependencies || [],
      devDependencies: componentData.devDependencies || [],
      registryDependencies: componentData.registryDependencies || [],
      files: componentData.files.length,
      path: `registry/${componentName}.json`
    });

    console.log(`✅ Added ${componentName} to registry`);
  } catch (error) {
    console.error(`❌ Error processing ${componentName}:`, error.message);
  }
}

// Sort components alphabetically
registryIndex.components.sort((a, b) => a.name.localeCompare(b.name));

// Write registry index
writeFileSync(
  join(registryDir, 'index.json'),
  JSON.stringify(registryIndex, null, 2)
);

// Generate TypeScript types for registry
const typesContent = `// Auto-generated registry types
export interface RegistryComponent {
  name: string;
  type: string;
  description: string;
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
  files: number;
  path: string;
}

export interface Registry {
  name: string;
  description: string;
  url: string;
  components: RegistryComponent[];
}

export const REGISTRY_COMPONENTS = ${JSON.stringify(
  registryIndex.components.map(c => c.name),
  null,
  2
)} as const;

export type ComponentName = typeof REGISTRY_COMPONENTS[number];
`;

writeFileSync(
  join(rootDir, 'apps', 'docs', 'lib', 'registry-types.ts'),
  typesContent
);

// Generate component list for documentation
const componentListMdx = `---
title: Component Registry
description: All available components in the Devcn UI registry
---

# Component Registry

The Devcn UI registry contains ${registryIndex.components.length} components that you can add to your project.

## Available Components

${registryIndex.components
    .map(
      component => `### [${component.name}](/components/${component.name})

${component.description}

\`\`\`bash
npx devcn-ui add ${component.name}
\`\`\`

**Dependencies:** ${component.dependencies.length > 0 ? component.dependencies.join(', ') : 'None'}
**Registry Dependencies:** ${component.registryDependencies.length > 0 ? component.registryDependencies.join(', ') : 'None'}

---`
    )
    .join('\n\n')}

## Installation

To install any component, use the Devcn UI CLI:

\`\`\`bash
npx devcn-ui add [component-name]
\`\`\`

You can also install multiple components at once:

\`\`\`bash
npx devcn-ui add button card dialog
\`\`\`
`;

writeFileSync(
  join(rootDir, 'apps', 'docs', 'content', 'docs', 'registry.mdx'),
  componentListMdx
);

console.log('');
console.log('✅ Registry generated successfully!');
console.log('');
console.log('📁 Files updated:');
console.log('   • apps/docs/public/registry/index.json');
console.log('   • apps/docs/lib/registry-types.ts');
console.log('   • apps/docs/content/docs/registry.mdx');
console.log('');
console.log(`📊 Registry Stats:`);
console.log(`   • Components: ${registryIndex.components.length}`);
console.log(`   • Total files: ${registryIndex.components.reduce((acc, c) => acc + c.files, 0)}`);
console.log('');
console.log('🌐 Registry available at: https://devcn-ui.dedevs.com/registry/index.json');
