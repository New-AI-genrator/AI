const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking TypeScript installation...');

try {
  // Check if TypeScript is installed
  require.resolve('typescript');
  console.log('TypeScript is installed.');
} catch (e) {
  console.log('TypeScript not found. Installing TypeScript and required types...');
  try {
    // Install TypeScript and required types
    execSync('npm install --no-save typescript @types/react @types/node @types/react-dom', { stdio: 'inherit' });
    console.log('Successfully installed TypeScript and types.');
  } catch (error) {
    console.error('Failed to install TypeScript:', error);
    process.exit(1);
  }
}

// Verify TypeScript configuration
const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
if (!fs.existsSync(tsConfigPath)) {
  console.log('Creating tsconfig.json...');
  fs.writeFileSync(tsConfigPath, JSON.stringify({
    "compilerOptions": {
      "target": "es5",
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve",
      "incremental": true,
      "plugins": [
        {
          "name": "next"
        }
      ],
      "paths": {
        "@/*": ["./*"]
      }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    "exclude": ["node_modules"]
  }, null, 2));
}

console.log('TypeScript setup complete.');
