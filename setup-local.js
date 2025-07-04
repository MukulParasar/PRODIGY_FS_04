#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up ChatFlow for local development...\n');

// Check if Node.js version is adequate
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Error: Node.js 18 or higher is required');
  console.log('   Current version:', nodeVersion);
  console.log('   Please upgrade Node.js: https://nodejs.org/');
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Check if npm is available
try {
  require('child_process').execSync('npm --version', { stdio: 'ignore' });
  console.log('✅ npm is available');
} catch (error) {
  console.error('❌ Error: npm is not available');
  console.log('   Please install Node.js with npm: https://nodejs.org/');
  process.exit(1);
}

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found');
  console.log('   Make sure you are in the ChatFlow project directory');
  process.exit(1);
}

console.log('✅ Project structure verified');

// Create local environment file
const envContent = `# ChatFlow Local Development Environment
NODE_ENV=development
PORT=5000

# Add any additional environment variables here
# DATABASE_URL=your_database_url_here
`;

if (!fs.existsSync('.env.local')) {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('✅ .env.local file already exists');
}

// Create local start script
const startScriptContent = `#!/bin/bash

echo "🚀 Starting ChatFlow local development server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

echo "🔧 Starting development server..."
echo "📱 Frontend will be available at: http://localhost:5000"
echo "🔌 WebSocket server will be running on the same port"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
`;

fs.writeFileSync('start-local.sh', startScriptContent);
fs.chmodSync('start-local.sh', '755');
console.log('✅ Created start-local.sh script');

// Create Windows batch script
const startScriptWinContent = `@echo off
echo 🚀 Starting ChatFlow local development server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
  echo 📦 Installing dependencies...
  npm install
)

echo 🔧 Starting development server...
echo 📱 Frontend will be available at: http://localhost:5000
echo 🔌 WebSocket server will be running on the same port
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
`;

fs.writeFileSync('start-local.bat', startScriptWinContent);
console.log('✅ Created start-local.bat script for Windows');

console.log('\n🎉 Local setup complete!\n');
console.log('📋 Next steps:');
console.log('   1. Install dependencies: npm install');
console.log('   2. Start the server: npm run dev');
console.log('   3. Open your browser: http://localhost:5000\n');
console.log('💡 Quick start options:');
console.log('   • Linux/Mac: ./start-local.sh');
console.log('   • Windows: start-local.bat');
console.log('   • Manual: npm run dev\n');
console.log('🔧 The application includes:');
console.log('   • Real-time messaging with WebSocket');
console.log('   • Multiple chat channels');
console.log('   • Typing indicators');
console.log('   • Emoji picker');
console.log('   • Responsive design\n');
console.log('📖 See README.md for detailed information');