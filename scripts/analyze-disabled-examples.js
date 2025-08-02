#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const examplesDir = join(process.cwd(), 'apps', 'docs', 'examples');

console.log('🔍 Analyzing disabled examples...\n');

// Get all disabled files
const disabledFiles = readdirSync(examplesDir)
  .filter(file => file.endsWith('.disabled'))
  .sort();

const categories = {
  simple: [],      // Simple "Example Component" patterns
  complex: [],     // Complex examples that might work
  ai: [],         // AI-related components
  broken: []      // Files with obvious issues
};

for (const disabledFile of disabledFiles) {
  const originalName = disabledFile.replace('.disabled', '');
  const filePath = join(examplesDir, disabledFile);
  
  try {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Categorize based on content
    if (originalName.startsWith('ai-')) {
      categories.ai.push(originalName);
    } else if (content.includes('Example ') && lines.length < 15) {
      categories.simple.push(originalName);
    } else if (content.includes('import') && content.includes('export default')) {
      categories.complex.push(originalName);
    } else {
      categories.broken.push(originalName);
    }
    
  } catch (error) {
    categories.broken.push(originalName);
  }
}

console.log('📊 Analysis Results:\n');

console.log(`🔧 Simple Examples (${categories.simple.length}) - Need manual fixes:`);
categories.simple.forEach(name => console.log(`   • ${name}`));

console.log(`\n✅ Complex Examples (${categories.complex.length}) - Likely to work after restore:`);
categories.complex.forEach(name => console.log(`   • ${name}`));

console.log(`\n🤖 AI Components (${categories.ai.length}) - Should work (AI-specific):`);
categories.ai.forEach(name => console.log(`   • ${name}`));

console.log(`\n❌ Broken/Unknown (${categories.broken.length}) - Need investigation:`);
categories.broken.forEach(name => console.log(`   • ${name}`));

console.log(`\n💡 Recommendations:`);
console.log(`   1. Start by restoring "Complex Examples" - they're most likely to work`);
console.log(`   2. AI Components should work if you have the @repo/ai package`);
console.log(`   3. Simple Examples need proper component implementations`);
console.log(`   4. Investigate broken examples individually`);
