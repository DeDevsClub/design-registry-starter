#!/usr/bin/env node

// Script to fix import paths in AI components to use @repo/shadcn-ui

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const aiDir = join(process.cwd(), 'packages', 'ai');

console.log('🔧 Fixing AI component import paths...');

// Get all AI component files
const aiFiles = readdirSync(aiDir).filter(file => file.endsWith('.tsx'));

let fixedCount = 0;

aiFiles.forEach(file => {
  const filePath = join(aiDir, file);
  
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
    
    if (modified) {
      writeFileSync(filePath, content);
      console.log(`✅ Fixed imports in: ${file}`);
      fixedCount++;
    }
  } catch (error) {
    console.log(`❌ Failed to fix ${file}: ${error.message}`);
  }
});

console.log(`\n🎉 Fixed imports in ${fixedCount} AI component files!`);
console.log('🚀 AI components now use proper @repo/shadcn-ui imports');
