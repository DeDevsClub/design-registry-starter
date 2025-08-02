#!/usr/bin/env node

// Script to fix import paths in AI example files

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const examplesDir = join(process.cwd(), 'apps', 'docs', 'examples');

console.log('🔧 Fixing AI example import paths...');

// Get all AI example files
const aiExampleFiles = readdirSync(examplesDir).filter(file => 
  file.startsWith('ai-') && file.endsWith('.tsx')
);

let fixedCount = 0;

aiExampleFiles.forEach(file => {
  const filePath = join(examplesDir, file);
  
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Fix @/components/ui/ imports
    if (content.includes('@/components/ui/')) {
      content = content.replace(/@\/components\/ui\//g, '@repo/shadcn-ui/components/ui/');
      modified = true;
    }
    
    // Fix @/lib/utils imports
    if (content.includes('@/lib/utils')) {
      content = content.replace(/@\/lib\/utils/g, '@repo/shadcn-ui/lib/utils');
      modified = true;
    }
    
    // Fix @/components/ imports (for AI components)
    if (content.includes('@/components/')) {
      content = content.replace(/@\/components\//g, '@repo/ai/');
      modified = true;
    }
    
    if (modified) {
      writeFileSync(filePath, content);
      console.log(`✅ Fixed imports in: ${file}`);
      fixedCount++;
    }
  } catch (error) {
    console.log(`❌ Failed to fix ${file}: ${error.message}`);
  }
});

console.log(`\n🎉 Fixed imports in ${fixedCount} AI example files!`);
console.log('🚀 AI examples now use proper import paths');
