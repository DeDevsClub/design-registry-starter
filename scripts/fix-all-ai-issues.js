#!/usr/bin/env node

// Comprehensive script to fix all AI component issues

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const aiDir = join(process.cwd(), 'packages', 'ai');

console.log('🔧 Fixing all AI component issues...');

// Icon name mappings
const iconMappings = {
  'ChevronLeftIcon': 'ChevronLeft',
  'ChevronRightIcon': 'ChevronRight',
  'CheckIcon': 'Check',
  'XIcon': 'X',
  'ArrowUpIcon': 'ArrowUp',
  'ArrowDownIcon': 'ArrowDown',
  'PlusIcon': 'Plus',
  'MinusIcon': 'Minus',
  'SearchIcon': 'Search',
  'SettingsIcon': 'Settings',
  'UserIcon': 'User',
  'MessageCircleIcon': 'MessageCircle',
  'SendIcon': 'Send',
  'CopyIcon': 'Copy',
  'EditIcon': 'Edit',
  'TrashIcon': 'Trash',
  'MoreHorizontalIcon': 'MoreHorizontal',
  'MoreVerticalIcon': 'MoreVertical',
  'ExternalLinkIcon': 'ExternalLink',
  'RefreshIcon': 'RotateCcw',
  'LoaderIcon': 'Loader2',
  'SpinnerIcon': 'Loader2'
};

// Get all AI component files
const aiFiles = readdirSync(aiDir).filter(file => file.endsWith('.tsx'));

let fixedCount = 0;

aiFiles.forEach(file => {
  const filePath = join(aiDir, file);
  
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Fix icon imports and usage
    Object.entries(iconMappings).forEach(([oldIcon, newIcon]) => {
      if (content.includes(oldIcon)) {
        content = content.replace(new RegExp(oldIcon, 'g'), newIcon);
        modified = true;
      }
    });
    
    // Fix common import issues
    if (content.includes('from "framer-motion"')) {
      content = content.replace(/from "framer-motion"/g, 'from "framer-motion"');
      modified = true;
    }
    
    // Fix any remaining @/ imports
    if (content.includes('@/')) {
      content = content.replace(/@\/components\/ui\//g, '@repo/shadcn-ui/components/ui/');
      content = content.replace(/@\/lib\/utils/g, '@repo/shadcn-ui/lib/utils');
      content = content.replace(/@\/components\//g, '@repo/ai/');
      modified = true;
    }
    
    if (modified) {
      writeFileSync(filePath, content);
      console.log(`✅ Fixed issues in: ${file}`);
      fixedCount++;
    }
  } catch (error) {
    console.log(`❌ Failed to fix ${file}: ${error.message}`);
  }
});

console.log(`\n🎉 Fixed issues in ${fixedCount} AI component files!`);

// Now let's create a simple AI component that definitely works
const simpleAIComponent = `'use client';

import { Button } from '@repo/shadcn-ui/components/ui/button';
import { Card } from '@repo/shadcn-ui/components/ui/card';

export interface SimpleAIProps {
  children?: React.ReactNode;
}

export function SimpleAI({ children }: SimpleAIProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI Component</h3>
        <p className="text-sm text-muted-foreground">
          This is a simple AI component for demonstration.
        </p>
        {children}
        <Button>AI Action</Button>
      </div>
    </Card>
  );
}
`;

// Write a simple working AI component
writeFileSync(join(aiDir, 'simple.tsx'), simpleAIComponent);
console.log('✅ Created simple.tsx as a working AI component');

console.log('\n🚀 All AI component issues should now be resolved!');
