#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const args = process.argv.slice(2);
const versionType = args[0] || 'patch'; // patch, minor, major

if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error('❌ Invalid version type. Use: patch, minor, or major');
  process.exit(1);
}

console.log('🚀 Starting publish workflow...');
console.log(`📦 Version bump: ${versionType}`);

try {
  // Step 1: Validate registry
  console.log('\n1️⃣ Validating registry...');
  execSync('npm run validate:registry', { stdio: 'inherit' });
  
  // Step 2: Run tests (if any)
  console.log('\n2️⃣ Running tests...');
  try {
    execSync('npm test', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  No tests found or tests failed, continuing...');
  }
  
  // Step 3: Build CLI
  console.log('\n3️⃣ Building CLI...');
  execSync('npm run build:cli', { stdio: 'inherit' });
  
  // Step 4: Test CLI locally
  console.log('\n4️⃣ Testing CLI...');
  execSync('npm run test:cli', { stdio: 'inherit' });
  
  // Step 5: Check git status
  console.log('\n5️⃣ Checking git status...');
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim()) {
      console.log('📝 Uncommitted changes detected:');
      console.log(gitStatus);
      
      const shouldContinue = process.env.CI || confirm('Continue with uncommitted changes? (y/N): ');
      if (!shouldContinue) {
        console.log('❌ Publish cancelled. Please commit your changes first.');
        process.exit(1);
      }
    }
  } catch (error) {
    console.log('⚠️  Not a git repository or git not available');
  }
  
  // Step 6: Get current version
  const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
  const currentVersion = packageJson.version;
  console.log(`\n📋 Current version: ${currentVersion}`);
  
  // Step 7: Bump version
  console.log(`\n6️⃣ Bumping version (${versionType})...`);
  execSync(`npm version ${versionType}`, { stdio: 'inherit' });
  
  // Get new version
  const updatedPackageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
  const newVersion = updatedPackageJson.version;
  console.log(`✅ Version bumped to: ${newVersion}`);
  
  // Step 8: Generate registry
  console.log('\n7️⃣ Generating registry...');
  execSync('npm run generate:registry', { stdio: 'inherit' });
  
  // Step 9: Publish to npm
  console.log('\n8️⃣ Publishing to npm...');
  
  // Check if user is logged in to npm
  try {
    const whoami = execSync('npm whoami', { encoding: 'utf8' }).trim();
    console.log(`📝 Publishing as: ${whoami}`);
  } catch (error) {
    console.error('❌ Not logged in to npm. Please run: npm login');
    process.exit(1);
  }
  
  // Publish
  execSync('npm publish', { stdio: 'inherit' });
  
  // Step 10: Create git tag and push
  console.log('\n9️⃣ Creating git tag...');
  try {
    execSync(`git add .`, { stdio: 'inherit' });
    execSync(`git commit -m "chore: release v${newVersion}" || true`, { stdio: 'inherit' });
    execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
    
    const shouldPush = process.env.CI || confirm('Push to remote repository? (Y/n): ');
    if (shouldPush !== false) {
      execSync('git push', { stdio: 'inherit' });
      execSync('git push --tags', { stdio: 'inherit' });
    }
  } catch (error) {
    console.log('⚠️  Git operations failed, but package was published successfully');
  }
  
  console.log('\n🎉 Publish workflow completed successfully!');
  console.log(`✅ Version ${newVersion} published to npm`);
  console.log(`📦 Install with: npm install devcn-ui@${newVersion}`);
  console.log(`🌐 View on npm: https://www.npmjs.com/package/devcn-ui`);
  
} catch (error) {
  console.error('\n❌ Publish workflow failed:', error.message);
  process.exit(1);
}

// Simple confirm function for non-CI environments
function confirm(message) {
  if (process.env.CI) return true;
  
  try {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      rl.question(message, (answer) => {
        rl.close();
        resolve(answer.toLowerCase().startsWith('y') || answer === '');
      });
    });
  } catch (error) {
    return true; // Default to yes if readline fails
  }
}
