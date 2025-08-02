#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Discovering all components in the project...\n');

const packagesDir = join(rootDir, 'packages');
const registryDir = join(rootDir, 'apps', 'docs', 'public', 'registry');

const discoveredComponents = [];

// Get all packages
const packages = readdirSync(packagesDir).filter(pkg => {
  const pkgPath = join(packagesDir, pkg);
  return statSync(pkgPath).isDirectory();
});

console.log(`📦 Scanning ${packages.length} packages...\n`);

for (const packageName of packages) {
  console.log(`🔍 Package: ${packageName}`);
  
  const packagePath = join(packagesDir, packageName);
  
  // Look for components in various locations
  const possibleComponentPaths = [
    join(packagePath, 'components'),
    join(packagePath, 'src', 'components'),
    join(packagePath, 'lib', 'components'),
    packagePath // Root of package
  ];
  
  for (const componentPath of possibleComponentPaths) {
    if (existsSync(componentPath)) {
      const components = findComponentsInDirectory(componentPath, packageName);
      discoveredComponents.push(...components);
    }
  }
}

// Display discovery results
console.log('\n📊 Discovery Results:');
console.log(`   🎯 Total components found: ${discoveredComponents.length}`);

if (discoveredComponents.length === 0) {
  console.log('\n⚠️  No components found. Make sure your components are in the expected locations:');
  console.log('   • packages/[package-name]/components/');
  console.log('   • packages/[package-name]/src/components/');
  console.log('   • packages/[package-name]/lib/components/');
  process.exit(0);
}

// Group by package
const componentsByPackage = discoveredComponents.reduce((acc, comp) => {
  if (!acc[comp.package]) acc[comp.package] = [];
  acc[comp.package].push(comp);
  return acc;
}, {});

console.log('\n📦 Components by package:');
for (const [pkg, components] of Object.entries(componentsByPackage)) {
  console.log(`   ${pkg}: ${components.length} components`);
  for (const comp of components) {
    const hasRegistry = existsSync(join(registryDir, `${comp.name}.json`));
    const status = hasRegistry ? '✅ registered' : '❌ not registered';
    console.log(`     • ${comp.name} (${status})`);
  }
}

// Check which components need registration
const unregisteredComponents = discoveredComponents.filter(comp => 
  !existsSync(join(registryDir, `${comp.name}.json`))
);

if (unregisteredComponents.length > 0) {
  console.log(`\n⚠️  Found ${unregisteredComponents.length} unregistered components:`);
  for (const comp of unregisteredComponents) {
    console.log(`   • ${comp.name} (${comp.package})`);
  }
  
  console.log('\n💡 To register all components, run:');
  console.log('   npm run register:all');
} else {
  console.log('\n✅ All discovered components are already registered!');
}

// Generate component map file
const componentMap = {
  packages: Object.keys(componentsByPackage),
  totalComponents: discoveredComponents.length,
  componentsByPackage,
  unregistered: unregisteredComponents.map(c => ({ name: c.name, package: c.package })),
  lastScanned: new Date().toISOString()
};

writeFileSync(
  join(rootDir, 'component-map.json'),
  JSON.stringify(componentMap, null, 2)
);

console.log('\n📄 Component map saved to: component-map.json');

// Helper functions

function findComponentsInDirectory(dir, packageName) {
  const components = [];
  
  if (!existsSync(dir)) return components;
  
  function scanDirectory(currentDir, depth = 0) {
    // Prevent infinite recursion
    if (depth > 3) return;
    
    try {
      const items = readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = join(currentDir, item);
        
        try {
          const stat = statSync(itemPath);
          
          if (stat.isDirectory()) {
            // Skip common non-component directories
            if (!['node_modules', '.git', 'dist', 'build', '__tests__', 'test'].includes(item)) {
              scanDirectory(itemPath, depth + 1);
            }
          } else if (stat.isFile()) {
            const component = analyzeComponentFile(itemPath, packageName);
            if (component) {
              components.push(component);
            }
          }
        } catch (error) {
          // Skip files/directories that can't be accessed
          continue;
        }
      }
    } catch (error) {
      // Skip directories that can't be read
      return;
    }
  }
  
  scanDirectory(dir);
  return components;
}

function analyzeComponentFile(filePath, packageName) {
  const ext = extname(filePath);
  const fileName = basename(filePath, ext);
  
  // Only process TypeScript/JavaScript React files
  if (!['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
    return null;
  }
  
  // Skip common non-component files
  const skipPatterns = [
    'index',
    '.test.',
    '.spec.',
    '.stories.',
    '.d.ts',
    'types',
    'utils',
    'helpers',
    'constants',
    'config'
  ];
  
  if (skipPatterns.some(pattern => fileName.includes(pattern))) {
    return null;
  }
  
  try {
    const content = readFileSync(filePath, 'utf8');
    
    // Check if it's likely a React component
    const hasReactImport = /import.*React|from\s+['"]react['"]/.test(content);
    const hasJSX = /<[A-Z]/.test(content) || /jsx/.test(content);
    const hasExport = /export\s+(default\s+)?(function|const|class)/.test(content);
    const hasForwardRef = /forwardRef/.test(content);
    
    if (!hasExport || (!hasReactImport && !hasJSX && !hasForwardRef)) {
      return null;
    }
    
    // Extract component name
    const componentName = getComponentNameFromFile(fileName);
    
    // Extract additional info
    const info = extractBasicComponentInfo(content, componentName);
    
    return {
      name: componentName,
      displayName: info.displayName,
      package: packageName,
      filePath,
      fileName,
      hasTypeScript: ext === '.tsx' || ext === '.ts',
      exports: info.exports,
      dependencies: info.dependencies
    };
    
  } catch (error) {
    return null;
  }
}

function getComponentNameFromFile(fileName) {
  // Convert PascalCase to kebab-case
  return fileName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function extractBasicComponentInfo(content, componentName) {
  const info = {
    displayName: '',
    exports: [],
    dependencies: []
  };
  
  // Extract display name (PascalCase)
  info.displayName = componentName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  // Extract exports
  const exportMatches = content.match(/export\s+(?:default\s+)?(?:const|function|class|interface|type)\s+(\w+)/g);
  if (exportMatches) {
    for (const exportMatch of exportMatches) {
      const match = exportMatch.match(/export\s+(?:default\s+)?(?:const|function|class|interface|type)\s+(\w+)/);
      if (match && match[1]) {
        info.exports.push(match[1]);
      }
    }
  }
  
  // Extract external dependencies
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
  
  return info;
}
