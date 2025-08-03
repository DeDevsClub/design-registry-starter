#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('Usage: npm run generate:component <component-name> [package-name]');
  console.log('Example: npm run generate:component button shadcn-ui');
  process.exit(1);
}

const componentName = args[0];
const packageName = args[1] || 'ui';

// Validate component name
if (!/^[a-z][a-z0-9-]*$/.test(componentName)) {
  console.error('❌ Component name must be lowercase and use kebab-case (e.g., "my-button")');
  process.exit(1);
}

console.log(`🚀 Generating component: ${componentName}`);
console.log(`📦 Package: ${packageName}`);

// Create package directory if it doesn't exist
const packageDir = join(rootDir, 'packages', packageName);
if (!existsSync(packageDir)) {
  mkdirSync(packageDir, { recursive: true });
  console.log(`📁 Created package directory: packages/${packageName}`);
}

// Create component directories
const componentDir = join(packageDir, 'components', componentName);
const examplesDir = join(rootDir, 'apps', 'docs', 'examples');
const contentDir = join(rootDir, 'apps', 'docs', 'content', 'components');

mkdirSync(componentDir, { recursive: true });
mkdirSync(examplesDir, { recursive: true });
mkdirSync(contentDir, { recursive: true });

// Generate component name variations
const pascalCase = componentName
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

const camelCase = componentName
  .split('-')
  .map((word, index) => 
    index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
  )
  .join('');

// Component template
const componentTemplate = `'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ${pascalCase}Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const ${pascalCase} = React.forwardRef<HTMLDivElement, ${pascalCase}Props>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          },
          // Sizes
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

${pascalCase}.displayName = '${pascalCase}';

export { ${pascalCase} };
`;

// Example template
const exampleTemplate = `import { ${pascalCase} } from '@repo/${packageName}/components/${componentName}';

export default function ${pascalCase}Example() {
  return (
    <div className="flex flex-wrap gap-4">
      <${pascalCase}>Default</${pascalCase}>
      <${pascalCase} variant="secondary">Secondary</${pascalCase}>
      <${pascalCase} size="sm">Small</${pascalCase}>
      <${pascalCase} size="lg">Large</${pascalCase}>
    </div>
  );
}
`;

// Documentation template
const docTemplate = `---
title: ${pascalCase}
description: A customizable ${componentName} component with multiple variants and sizes.
component: true
---

<ComponentPreview name="${componentName}" />

## Installation

\`\`\`bash
npx devcn-ui add ${componentName}
\`\`\`

## Usage

\`\`\`tsx
import { ${pascalCase} } from '@repo/${packageName}/components/${componentName}';

export default function Example() {
  return <${pascalCase}>Click me</${pascalCase}>;
}
\`\`\`

## Examples

### Variants

<ComponentPreview name="${componentName}-variants" />

### Sizes

<ComponentPreview name="${componentName}-sizes" />

## API Reference

### ${pascalCase}

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`variant\` | \`'default' \\| 'secondary'\` | \`'default'\` | The visual style variant |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | The size of the component |
| \`className\` | \`string\` | - | Additional CSS classes |

<PoweredBy packages={[
  { name: "React", icon: "logos:react" },
  { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" }
]} />
`;

// Registry template
const registryTemplate = {
  name: componentName,
  type: 'registry:ui',
  dependencies: [],
  devDependencies: [],
  registryDependencies: [],
  files: [
    {
      path: `components/${componentName}.tsx`,
      content: componentTemplate,
      type: 'registry:ui'
    }
  ]
};

// Write files
writeFileSync(join(componentDir, `${componentName}.tsx`), componentTemplate);
writeFileSync(join(examplesDir, `${componentName}.tsx`), exampleTemplate);
writeFileSync(join(contentDir, `${componentName}.mdx`), docTemplate);

// Create registry file
const registryDir = join(rootDir, 'apps', 'docs', 'public', 'registry');
mkdirSync(registryDir, { recursive: true });
writeFileSync(
  join(registryDir, `${componentName}.json`),
  JSON.stringify(registryTemplate, null, 2)
);

console.log('✅ Component generated successfully!');
console.log('');
console.log('📁 Files created:');
console.log(`   • packages/${packageName}/components/${componentName}/${componentName}.tsx`);
console.log(`   • apps/docs/examples/${componentName}.tsx`);
console.log(`   • apps/docs/content/components/${componentName}.mdx`);
console.log(`   • apps/docs/public/registry/${componentName}.json`);
console.log('');
console.log('🔧 Next steps:');
console.log('1. Customize the component implementation');
console.log('2. Add additional examples if needed');
console.log('3. Update the documentation');
console.log('4. Test the component with: npm run test:cli');
console.log(`5. Add to registry with: npm run generate:registry`);
