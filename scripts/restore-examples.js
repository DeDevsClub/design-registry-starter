#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const examplesDir = join(process.cwd(), 'apps', 'docs', 'examples');

console.log('🔄 Restoring disabled examples...\n');

// Get all disabled files
const disabledFiles = readdirSync(examplesDir)
  .filter(file => file.endsWith('.disabled'))
  .sort();

console.log(`Found ${disabledFiles.length} disabled examples:\n`);

let restored = 0;
let skipped = 0;

for (const disabledFile of disabledFiles) {
  const originalName = disabledFile.replace('.disabled', '');
  const disabledPath = join(examplesDir, disabledFile);
  const originalPath = join(examplesDir, originalName);
  
  try {
    // Read the disabled file content
    const content = readFileSync(disabledPath, 'utf8');
    
    // Check if it's a simple "Example Component" pattern that needs fixing
    const isSimpleExample = content.includes('Example ') && 
                           content.split('\n').length < 15;
    
    if (isSimpleExample) {
      console.log(`⚠️  Skipping ${originalName} - needs manual fix (simple example)`);
      skipped++;
      continue;
    }
    
    // Restore the file
    renameSync(disabledPath, originalPath);
    console.log(`✅ Restored ${originalName}`);
    restored++;
    
  } catch (error) {
    console.log(`❌ Failed to restore ${originalName}: ${error.message}`);
    skipped++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   ✅ Restored: ${restored}`);
console.log(`   ⚠️  Skipped: ${skipped}`);
console.log(`\n🔧 Next steps:`);
console.log(`   1. Run "pnpm build" to test the restored examples`);
console.log(`   2. Fix any remaining issues with skipped examples`);
console.log(`   3. Remove remaining .disabled files when ready`);
