#!/usr/bin/env node

// Helper script to fix a simple example
// Usage: node scripts/fix-simple-example.js button

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const componentName = process.argv[2];
if (!componentName) {
  console.log('Usage: node scripts/fix-simple-example.js <component-name>');
  process.exit(1);
}

const examplesDir = join(process.cwd(), 'apps', 'docs', 'examples');
const disabledPath = join(examplesDir, `${componentName}.tsx.disabled`);
const outputPath = join(examplesDir, `${componentName}.tsx`);

// Component-specific example templates
const examples = {
  button: `import { Button } from '@repo/shadcn-ui/components/ui/button';

export default function ButtonExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}`,

  tabs: `import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/shadcn-ui/components/ui/tabs';

export default function TabsExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <p>Make changes to your account here.</p>
        </TabsContent>
        <TabsContent value="password">
          <p>Change your password here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}`,

  alert: `import { Alert, AlertDescription, AlertTitle } from '@repo/shadcn-ui/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AlertExample() {
  return (
    <div className="flex flex-col gap-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
    </div>
  );
}`,

  badge: `import { Badge } from '@repo/shadcn-ui/components/ui/badge';

export default function BadgeExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}`,

  input: `import { Input } from '@repo/shadcn-ui/components/ui/input';

export default function InputExample() {
  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input placeholder="Search..." />
      <Input disabled placeholder="Disabled input" />
    </div>
  );
}`
};

// Generate a basic example if no specific template exists
function generateBasicExample(name) {
  const componentName = name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  
  return `import { ${componentName} } from '@repo/shadcn-ui/components/ui/${name}';

export default function ${componentName}Example() {
  return (
    <div className="flex flex-wrap gap-4">
      <${componentName}>
        Example ${componentName}
      </${componentName}>
    </div>
  );
}`;
}

try {
  const template = examples[componentName] || generateBasicExample(componentName);
  writeFileSync(outputPath, template);
  console.log(`✅ Created ${componentName}.tsx with proper implementation`);
} catch (error) {
  console.log(`❌ Failed to create ${componentName}.tsx: ${error.message}`);
}
