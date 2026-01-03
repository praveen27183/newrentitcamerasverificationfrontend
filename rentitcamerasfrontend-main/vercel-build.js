const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting Vercel build process...');

// Ensure node_modules/.bin has correct permissions
try {
  console.log('Setting up environment...');
  
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Create a custom Vite runner script
  console.log('Creating Vite runner...');
  const viteRunner = `#!/usr/bin/env node
require('vite/bin/vite');
`;
  
  fs.writeFileSync('node_modules/.vite-runner.js', viteRunner);
  
  // Run the build
  console.log('Running build...');
  execSync('node node_modules/vite/bin/vite.js build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
