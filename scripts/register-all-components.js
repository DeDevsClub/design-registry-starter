#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Scanning for components to register...');

const packagesDir = join(rootDir, 'packages');
const registryDir = join(rootDir, 'apps', 'docs', 'public', 'registry');
const examplesDir = join(rootDir, 'apps', 'docs', 'examples');
const contentDir = join(rootDir, 'apps', 'docs', 'content', 'components');

// Ensure directories exist
mkdirSync(registryDir, { recursive: true });
mkdirSync(examplesDir, { recursive: true });
mkdirSync(contentDir, { recursive: true });

let registeredCount = 0;
let skippedCount = 0;

// Get all packages
const packages = readdirSync(packagesDir).filter(pkg => {
  const pkgPath = join(packagesDir, pkg);
  return statSync(pkgPath).isDirectory();
});

console.log(`📦 Found ${packages.length} packages: ${packages.join(', ')}\n`);

for (const packageName of packages) {
  console.log(`🔍 Scanning package: ${packageName}`);
  
  const packagePath = join(packagesDir, packageName);
  const componentsPath = join(packagePath, 'components');
  
  // Skip if no components directory
  if (!existsSync(componentsPath)) {
    console.log(`   ⚠️  No components directory found in ${packageName}`);
    continue;
  }
  
  // Scan for component files
  const componentFiles = scanForComponents(componentsPath);
  
  for (const componentFile of componentFiles) {
    const componentName = getComponentNameFromFile(componentFile);
    
    if (!componentName) {
      console.log(`   ⚠️  Could not determine component name from ${componentFile}`);
      continue;
    }
    
    // Check if registry file already exists
    const registryPath = join(registryDir, `${componentName}.json`);
    if (existsSync(registryPath)) {
      console.log(`   ⏭️  Registry already exists for ${componentName}`);
      skippedCount++;
      continue;
    }
    
    try {
      // Read component file content
      const componentContent = readFileSync(componentFile, 'utf8');
      
      // Extract component info
      const componentInfo = extractComponentInfo(componentContent, componentName, packageName);
      
      // Generate registry entry
      const registryEntry = generateRegistryEntry(
        componentName,
        componentInfo,
        componentContent,
        packageName
      );
      
      // Write registry file
      writeFileSync(registryPath, JSON.stringify(registryEntry, null, 2));
      
      // Generate example if it doesn't exist
      generateExampleIfMissing(componentName, componentInfo, packageName);
      
      // Generate documentation if it doesn't exist
      generateDocumentationIfMissing(componentName, componentInfo, packageName);
      
      console.log(`   ✅ Registered ${componentName}`);
      registeredCount++;
      
    } catch (error) {
      console.error(`   ❌ Failed to register ${componentName}:`, error.message);
    }
  }
}

console.log('\n📊 Registration Summary:');
console.log(`   ✅ Registered: ${registeredCount} components`);
console.log(`   ⏭️  Skipped (already exists): ${skippedCount} components`);

if (registeredCount > 0) {
  console.log('\n🔄 Generating registry index...');
  try {
    // Run the generate registry script
    const { execSync } = await import('node:child_process');
    execSync('npm run generate:registry', { stdio: 'inherit' });
    console.log('✅ Registry index updated successfully!');
  } catch (error) {
    console.error('❌ Failed to update registry index:', error.message);
  }
}

console.log('\n🎉 Component registration complete!');

// Helper functions

function scanForComponents(dir) {
  const components = [];
  
  function scanDirectory(currentDir) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = join(currentDir, item);
      const stat = statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanDirectory(itemPath);
      } else if (stat.isFile() && (extname(item) === '.tsx' || extname(item) === '.ts')) {
        // Skip index files and test files
        if (!item.includes('index') && !item.includes('.test.') && !item.includes('.spec.')) {
          components.push(itemPath);
        }
      }
    }
  }
  
  scanDirectory(dir);
  return components;
}

function getComponentNameFromFile(filePath) {
  const fileName = basename(filePath, extname(filePath));
  
  // Convert PascalCase to kebab-case
  return fileName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function extractComponentInfo(content, componentName, packageName) {
  const info = {
    displayName: '',
    description: '',
    dependencies: [],
    exports: []
  };
  
  // Extract display name (PascalCase)
  info.displayName = componentName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  // Extract dependencies from imports
  const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g);
  if (importMatches) {
    for (const importMatch of importMatches) {
      const match = importMatch.match(/from\s+['"]([^'"]+)['"]/);
      if (match && match[1]) {
        const dep = match[1];
        if (!dep.startsWith('.') && !dep.startsWith('@/') && !dep.startsWith('@repo/')) {
          info.dependencies.push(dep);
        }
      }
    }
  }
  
  // Extract exports
  const exportMatches = content.match(/export\s+(?:const|function|class|interface|type)\s+(\w+)/g);
  if (exportMatches) {
    for (const exportMatch of exportMatches) {
      const match = exportMatch.match(/export\s+(?:const|function|class|interface|type)\s+(\w+)/);
      if (match && match[1]) {
        info.exports.push(match[1]);
      }
    }
  }
  
  // Extract JSDoc description
  const jsdocMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n\s*\*\//);
  if (jsdocMatch && jsdocMatch[1]) {
    info.description = jsdocMatch[1];
  } else {
    info.description = `A customizable ${componentName} component.`;
  }
  
  return info;
}

function generateRegistryEntry(componentName, componentInfo, content, packageName) {
  return {
    name: componentName,
    type: 'components:ui',
    description: componentInfo.description,
    dependencies: [...new Set(componentInfo.dependencies)], // Remove duplicates
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: `components/${componentName}.tsx`,
        content: content,
        type: 'components:ui'
      }
    ]
  };
}

function generateExampleIfMissing(componentName, componentInfo, packageName) {
  const examplePath = join(examplesDir, `${componentName}.tsx`);
  
  if (existsSync(examplePath)) {
    return; // Example already exists
  }
  
  const exampleTemplate = `import { ${componentInfo.displayName} } from '@repo/${packageName}/components/${componentName}';

export default function ${componentInfo.displayName}Example() {
  return (
    <div className="flex flex-wrap gap-4">
      <${componentInfo.displayName}>
        Example ${componentInfo.displayName}
      </${componentInfo.displayName}>
    </div>
  );
}
`;
  
  writeFileSync(examplePath, exampleTemplate);
  console.log(`   📄 Generated example: ${componentName}.tsx`);
}

function generateDocumentationIfMissing(componentName, componentInfo, packageName) {
  const docPath = join(contentDir, `${componentName}.mdx`);
  
  if (existsSync(docPath)) {
    return; // Documentation already exists
  }
  
  const docTemplate = `---
title: ${componentInfo.displayName}
description: ${componentInfo.description}
component: true
---

<ComponentPreview name="${componentName}" />

## Installation

\`\`\`bash
npx devcn-ui add ${componentName}
\`\`\`

## Usage

\`\`\`tsx
import { ${componentInfo.displayName} } from '@repo/${packageName}/components/${componentName}';

export default function Example() {
  return (
    <${componentInfo.displayName}>
      Your content here
    </${componentInfo.displayName}>
  );
}
\`\`\`

## API Reference

### ${componentInfo.displayName}

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`className\` | \`string\` | - | Additional CSS classes |
| \`children\` | \`ReactNode\` | - | The content of the component |

<PoweredBy packages={[
  { name: "React", icon: "logos:react" },
  { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" }
]} />
`;
  
  writeFileSync(docPath, docTemplate);
  console.log(`   📚 Generated documentation: ${componentName}.mdx`);
}
