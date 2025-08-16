const { execSync } = require('child_process');

console.log('Installing TypeScript and required types...');
try {
  // Install TypeScript and required types as dev dependencies
  execSync('npm install --save-dev typescript @types/react @types/node @types/react-dom', { stdio: 'inherit' });
  
  console.log('Running TypeScript type checking...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  
  console.log('Building Next.js application...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
