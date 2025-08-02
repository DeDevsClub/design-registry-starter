#!/usr/bin/env node

// Script to create a minimalistic template by removing excessive components
// Keeps only essential components for a clean starter

import { unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const componentsDir = join(process.cwd(), 'packages', 'shadcn-ui', 'components', 'ui');
const examplesDir = join(process.cwd(), 'apps', 'docs', 'examples');

// Essential components to KEEP for minimalistic template
const keepComponents = [
  'button',
  'input',
  'label',
  'card',
  'badge',
  'alert',
  'tabs',
  'form'
];

// Get all component files
const allComponentFiles = [
  'accordion', 'alert-dialog', 'aspect-ratio', 'avatar', 'breadcrumb',
  'calendar', 'carousel', 'chart', 'checkbox', 'collapsible', 'command',
  'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'hover-card',
  'input-otp', 'menubar', 'navigation-menu', 'pagination', 'popover',
  'progress', 'radio-group', 'resizable', 'scroll-area', 'select',
  'separator', 'sheet', 'sidebar', 'skeleton', 'slider', 'sonner',
  'switch', 'table', 'textarea', 'toast', 'toaster', 'toggle-group',
  'toggle', 'tooltip'
];

// Components to remove (all except the ones we keep)
const removeComponents = allComponentFiles.filter(comp => !keepComponents.includes(comp));

console.log('🧹 Creating minimalistic template...');
console.log(`📦 Keeping ${keepComponents.length} essential components:`, keepComponents.join(', '));
console.log(`🗑️  Removing ${removeComponents.length} excessive components`);

let removedCount = 0;

// Remove component files
removeComponents.forEach(component => {
  const componentPath = join(componentsDir, `${component}.tsx`);
  if (existsSync(componentPath)) {
    try {
      unlinkSync(componentPath);
      console.log(`✅ Removed component: ${component}.tsx`);
      removedCount++;
    } catch (error) {
      console.log(`❌ Failed to remove component ${component}.tsx: ${error.message}`);
    }
  }
});

// Remove example files for removed components
removeComponents.forEach(component => {
  const examplePath = join(examplesDir, `${component}.tsx`);
  if (existsSync(examplePath)) {
    try {
      unlinkSync(examplePath);
      console.log(`✅ Removed example: ${component}.tsx`);
      removedCount++;
    } catch (error) {
      console.log(`❌ Failed to remove example ${component}.tsx: ${error.message}`);
    }
  }
});

// Remove AI-specific examples
const aiExamples = [
  'ai-branch', 'ai-chatbot', 'ai-conversation', 'ai-input-icons', 'ai-input',
  'ai-message-markdown', 'ai-message', 'ai-reasoning', 'ai-response',
  'ai-sources-custom', 'ai-sources', 'ai-suggestion-input', 'ai-suggestion', 'ai-tool'
];

aiExamples.forEach(example => {
  const examplePath = join(examplesDir, `${example}.tsx`);
  if (existsSync(examplePath)) {
    try {
      unlinkSync(examplePath);
      console.log(`✅ Removed AI example: ${example}.tsx`);
      removedCount++;
    } catch (error) {
      console.log(`❌ Failed to remove AI example ${example}.tsx: ${error.message}`);
    }
  }
});

// Remove code-block and snippet examples
const codeExamples = [
  'code-block copy', 'code-block-diff', 'code-block-focus', 'code-block-headless',
  'code-block-highlight-line', 'code-block-highlight-word', 'code-block-no-highlighting',
  'code-block-numberless', 'code-block-theme', 'code-block', 'snippet-npm', 'snippet'
];

codeExamples.forEach(example => {
  const examplePath = join(examplesDir, `${example}.tsx`);
  if (existsSync(examplePath)) {
    try {
      unlinkSync(examplePath);
      console.log(`✅ Removed code example: ${example}.tsx`);
      removedCount++;
    } catch (error) {
      console.log(`❌ Failed to remove code example ${example}.tsx: ${error.message}`);
    }
  }
});

console.log(`\n🎉 Minimalistic template created!`);
console.log(`📊 Summary:`);
console.log(`   • Removed ${removedCount} files`);
console.log(`   • Kept ${keepComponents.length} essential components`);
console.log(`   • Template is now clean and minimalistic`);
console.log(`\n🚀 Next steps:`);
console.log(`   • Run 'pnpm build' to verify everything works`);
console.log(`   • Run 'pnpm dev' to test the documentation site`);
console.log(`   • Add new components as needed using the CLI`);
