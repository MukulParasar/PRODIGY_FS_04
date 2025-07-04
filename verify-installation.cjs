#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying ChatFlow installation...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.log('❌ Node.js version too old:', nodeVersion);
  console.log('   Required: Node.js 18 or higher');
  console.log('   Download: https://nodejs.org/\n');
  process.exit(1);
} else {
  console.log('✅ Node.js version:', nodeVersion);
}

// Check required files
const requiredFiles = [
  'package.json',
  'client/src/App.tsx',
  'server/index.ts',
  'server/routes.ts',
  'shared/schema.ts'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log('✅ Found:', file);
  } else {
    console.log('❌ Missing:', file);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please re-download the complete package.\n');
  process.exit(1);
}

// Check if dependencies are installed
if (fs.existsSync('node_modules')) {
  console.log('✅ Dependencies are installed');
} else {
  console.log('⚠️  Dependencies not installed yet');
  console.log('   Run: npm install');
}

console.log('\n🎉 Installation verification complete!');
console.log('\n📋 Next steps:');
if (!fs.existsSync('node_modules')) {
  console.log('   1. Install dependencies: npm install');
  console.log('   2. Start the server: npm run dev');
} else {
  console.log('   1. Start the server: npm run dev');
}
console.log('   2. Open browser: http://localhost:5000\n');