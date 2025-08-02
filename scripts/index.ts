#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const command = args[0];

// Show help
if (!command || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

// Show version
if (command === '--version' || command === '-v') {
  showVersion();
  process.exit(0);
}

// Handle add command
if (command === 'add') {
  if (args.length < 2) {
    console.error('❌ Error: Please specify at least one component to add.');
    console.log('\nUsage: npx devcn-ui add <component-name> [component-name...]');
    console.log('Example: npx devcn-ui add button card dialog');
    process.exit(1);
  }

  const packageNames = args.slice(1);
  let successCount = 0;
  let errorCount = 0;

  console.log(`🚀 Adding ${packageNames.length} component(s)...\n`);

  for (const packageName of packageNames) {
    if (!packageName.trim()) {
      continue;
    }

    try {
      console.log(`📦 Adding ${packageName} component...`);

      const url = new URL(
        `registry/${packageName}.json`,
        'https://devcn-ui.dedevs.com'
      );

      // Use shadcn/ui CLI to add the component
      execSync(`npx shadcn@latest add ${url.toString()}`, {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      console.log(`✅ Successfully added ${packageName}\n`);
      successCount++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to add ${packageName}:`, errorMessage);
      console.log(`   Make sure the component exists and you have internet connection.\n`);
      errorCount++;
    }
  }

  // Summary
  console.log('📊 Summary:');
  console.log(`   ✅ Successfully added: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   ❌ Failed: ${errorCount}`);
  }

  if (errorCount > 0) {
    process.exit(1);
  }
} else {
  console.error(`❌ Unknown command: ${command}`);
  console.log('\nRun "npx devcn-ui --help" for usage information.');
  process.exit(1);
}

function showHelp() {
  console.log(`
🎨 Devcn UI - Component Registry CLI
`);
  console.log('Add beautiful, accessible components to your React project.\n');

  console.log('USAGE:');
  console.log('  npx devcn-ui <command> [options]\n');

  console.log('COMMANDS:');
  console.log('  add <component...>    Add one or more components to your project');
  console.log('  --help, -h           Show this help message');
  console.log('  --version, -v        Show version information\n');

  console.log('EXAMPLES:');
  console.log('  npx devcn-ui add button');
  console.log('  npx devcn-ui add button card dialog');
  console.log('  npx devcn-ui --help\n');

  console.log('DOCUMENTATION:');
  console.log('  https://devcn-ui.dedevs.com\n');

  console.log('ISSUES:');
  console.log('  https://github.com/DeDevsClub/design-registry-starter/issues\n');
}

function showVersion() {
  try {
    // Try to read version from package.json in the same directory
    const packagePath = join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    console.log(`devcn-ui v${packageJson.version}`);
  } catch (error) {
    console.log('devcn-ui (version unknown)');
  }
}
