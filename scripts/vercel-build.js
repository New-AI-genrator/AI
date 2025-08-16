const { execSync } = require('child_process');

console.log('Installing TypeScript and dependencies...');
try {
  // Install dev dependencies
  execSync('npm install --include=dev', { stdio: 'inherit' });
  
  // Install TypeScript and types explicitly
  execSync('npm install typescript @types/react @types/node @types/react-dom --no-save', { stdio: 'inherit' });
  
  console.log('Running Next.js build...');
  // Run the build
  execSync('next build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
