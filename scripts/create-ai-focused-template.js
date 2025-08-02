#!/usr/bin/env node

// Script to create an AI-focused minimalistic template
// Keeps ALL AI components and only essential UI components needed for AI chatbot functionality

import { unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const componentsDir = join(process.cwd(), 'packages', 'shadcn-ui', 'components', 'ui');
const examplesDir = join(process.cwd(), 'apps', 'docs', 'examples');

// Essential UI components to KEEP (required for AI chatbot functionality)
const keepUIComponents = [
  // Core form components (needed for AI input)
  'button',
  'input', 
  'label',
  'form',
  'textarea',
  
  // Layout components (needed for chat interface)
  'card',
  'separator',
  'scroll-area',
  
  // Feedback components (needed for AI responses)
  'alert',
  'badge',
  'skeleton',
  
  // Navigation (needed for chat interface)
  'tabs',
  
  // Overlays (needed for AI interactions)
  'dialog',
  'sheet',
  'popover',
  'tooltip',
  
  // Advanced form (needed for AI settings)
  'switch',
  'select',
  'checkbox',
  
  // Content display (needed for AI responses)
  'collapsible',
  'accordion'
];

// All UI components that exist
const allUIComponents = [
  'alert-dialog', 'aspect-ratio', 'avatar', 'breadcrumb',
  'calendar', 'carousel', 'chart', 'command', 'context-menu', 
  'drawer', 'dropdown-menu', 'hover-card', 'input-otp', 
  'menubar', 'navigation-menu', 'pagination', 'progress', 
  'radio-group', 'resizable', 'sidebar', 'slider', 'sonner',
  'table', 'toast', 'toaster', 'toggle-group', 'toggle'
];

// Components to remove (complex/unnecessary for AI chatbot)
const removeUIComponents = allUIComponents.filter(comp => !keepUIComponents.includes(comp));

console.log('🤖 Creating AI-focused minimalistic template...');
console.log(`✅ Keeping ALL AI components`);
console.log(`📦 Keeping ${keepUIComponents.length} essential UI components for AI functionality`);
console.log(`🗑️  Removing ${removeUIComponents.length} non-essential UI components`);

let removedCount = 0;

// Remove non-essential UI component files
removeUIComponents.forEach(component => {
  const componentPath = join(componentsDir, `${component}.tsx`);
  if (existsSync(componentPath)) {
    try {
      unlinkSync(componentPath);
      console.log(`✅ Removed UI component: ${component}.tsx`);
      removedCount++;
    } catch (error) {
      console.log(`❌ Failed to remove UI component ${component}.tsx: ${error.message}`);
    }
  }
});

// Remove example files for removed UI components
removeUIComponents.forEach(component => {
  const examplePath = join(examplesDir, `${component}.tsx`);
  if (existsSync(examplePath)) {
    try {
      unlinkSync(examplePath);
      console.log(`✅ Removed UI example: ${component}.tsx`);
      removedCount++;
    } catch (error) {
      console.log(`❌ Failed to remove UI example ${component}.tsx: ${error.message}`);
    }
  }
});

// Remove code-block and snippet examples (not needed for AI focus)
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

console.log(`\n🤖 AI-focused template created!`);
console.log(`📊 Summary:`);
console.log(`   • Removed ${removedCount} non-essential files`);
console.log(`   • Kept ALL AI components for chatbot functionality`);
console.log(`   • Kept ${keepUIComponents.length} essential UI components`);
console.log(`   • Template is now AI-focused and minimalistic`);
console.log(`\n🚀 Next steps:`);
console.log(`   • Run 'pnpm build' to verify everything works`);
console.log(`   • Run 'pnpm dev' to test the AI chatbot components`);
console.log(`   • Focus on AI component development and examples`);
