#!/usr/bin/env node

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Validating registry...');

const registryDir = join(rootDir, 'apps', 'docs', 'public', 'registry');
const examplesDir = join(rootDir, 'apps', 'docs', 'examples');
const contentDir = join(rootDir, 'apps', 'docs', 'content', 'components');

let errors = 0;
let warnings = 0;

// Required fields for registry components
const requiredFields = ['name', 'type', 'files'];
const validTypes = ['registry:ui', 'registry:block', 'registry:example'];

if (!existsSync(registryDir)) {
  console.error('❌ Registry directory not found');
  process.exit(1);
}

// Get all registry files
const registryFiles = readdirSync(registryDir)
  .filter(file => file.endsWith('.json') && file !== 'index.json');

console.log(`📦 Validating ${registryFiles.length} registry files...\n`);

for (const file of registryFiles) {
  const componentName = file.replace('.json', '');
  console.log(`🔍 Validating ${componentName}...`);
  
  try {
    const registryPath = join(registryDir, file);
    const componentData = JSON.parse(readFileSync(registryPath, 'utf8'));
    
    // Validate required fields
    for (const field of requiredFields) {
      if (!componentData[field]) {
        console.error(`   ❌ Missing required field: ${field}`);
        errors++;
      }
    }
    
    // Validate type
    if (componentData.type && !validTypes.includes(componentData.type)) {
      console.error(`   ❌ Invalid type: ${componentData.type}. Must be one of: ${validTypes.join(', ')}`);
      errors++;
    }
    
    // Validate files array
    if (componentData.files && Array.isArray(componentData.files)) {
      for (const fileData of componentData.files) {
        if (!fileData.path) {
          console.error(`   ❌ File missing path property`);
          errors++;
        }
        if (!fileData.content && !fileData.target) {
          console.error(`   ❌ File missing content or target property`);
          errors++;
        }
      }
    } else {
      console.error(`   ❌ Files must be an array`);
      errors++;
    }
    
    // Check if example file exists
    const examplePath = join(examplesDir, `${componentName}.tsx`);
    if (!existsSync(examplePath)) {
      console.warn(`   ⚠️  Example file not found: examples/${componentName}.tsx`);
      warnings++;
    }
    
    // Check if documentation exists
    const docPath = join(contentDir, `${componentName}.mdx`);
    if (!existsSync(docPath)) {
      console.warn(`   ⚠️  Documentation not found: content/components/${componentName}.mdx`);
      warnings++;
    }
    
    // Validate dependencies
    if (componentData.dependencies && !Array.isArray(componentData.dependencies)) {
      console.error(`   ❌ Dependencies must be an array`);
      errors++;
    }
    
    if (componentData.devDependencies && !Array.isArray(componentData.devDependencies)) {
      console.error(`   ❌ DevDependencies must be an array`);
      errors++;
    }
    
    if (componentData.registryDependencies && !Array.isArray(componentData.registryDependencies)) {
      console.error(`   ❌ RegistryDependencies must be an array`);
      errors++;
    }
    
    // Check for circular dependencies
    if (componentData.registryDependencies && componentData.registryDependencies.includes(componentName)) {
      console.error(`   ❌ Circular dependency detected: component depends on itself`);
      errors++;
    }
    
    console.log(`   ✅ ${componentName} validation complete`);
    
  } catch (error) {
    console.error(`   ❌ JSON parsing error: ${error.message}`);
    errors++;
  }
  
  console.log('');
}

// Validate registry index
const indexPath = join(registryDir, 'index.json');
if (existsSync(indexPath)) {
  console.log('🔍 Validating registry index...');
  try {
    const indexData = JSON.parse(readFileSync(indexPath, 'utf8'));
    
    if (!indexData.name) {
      console.error('   ❌ Registry index missing name');
      errors++;
    }
    
    if (!indexData.components || !Array.isArray(indexData.components)) {
      console.error('   ❌ Registry index missing components array');
      errors++;
    } else {
      // Check if all registry files are included in index
      const indexComponents = indexData.components.map(c => c.name);
      const registryComponents = registryFiles.map(f => f.replace('.json', ''));
      
      for (const component of registryComponents) {
        if (!indexComponents.includes(component)) {
          console.warn(`   ⚠️  Component ${component} not found in index`);
          warnings++;
        }
      }
      
      for (const component of indexComponents) {
        if (!registryComponents.includes(component)) {
          console.error(`   ❌ Index references non-existent component: ${component}`);
          errors++;
        }
      }
    }
    
    console.log('   ✅ Registry index validation complete');
  } catch (error) {
    console.error(`   ❌ Registry index JSON parsing error: ${error.message}`);
    errors++;
  }
} else {
  console.warn('⚠️  Registry index not found. Run npm run generate:registry to create it.');
  warnings++;
}

console.log('\n📊 Validation Summary:');
console.log(`   • Files validated: ${registryFiles.length}`);
console.log(`   • Errors: ${errors}`);
console.log(`   • Warnings: ${warnings}`);

if (errors > 0) {
  console.log('\n❌ Validation failed. Please fix the errors above.');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  Validation completed with warnings.');
  process.exit(0);
} else {
  console.log('\n✅ All validations passed!');
  process.exit(0);
}
