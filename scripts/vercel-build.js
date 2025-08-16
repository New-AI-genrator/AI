const { execSync } = require('child_process');

console.log('=== Starting Vercel Build Script ===');

// Function to run commands with better error handling
function runCommand(command, description) {
  console.log(`\n=== ${description} ===`);
  console.log(`$ ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error);
    return false;
  }
}

// Main build process
console.log('=== Installing Dependencies ===');
if (!runCommand('npm install --include=dev', 'Installing dev dependencies')) {
  console.error('❌ Failed to install dev dependencies');
  process.exit(1);
}

console.log('\n=== Installing TypeScript and Types ===');
if (!runCommand('npm install typescript @types/react @types/node @types/react-dom --no-save', 'Installing TypeScript and types')) {
  console.error('❌ Failed to install TypeScript and types');
  process.exit(1);
}

console.log('\n=== Running Next.js Build ===');
if (!runCommand('next build', 'Next.js build')) {
  console.error('❌ Next.js build failed');
  process.exit(1);
}

console.log('\n✅ Build completed successfully!');
process.exit(0);
