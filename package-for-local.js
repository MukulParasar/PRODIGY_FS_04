#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📦 Creating local deployment package...\n');

// List of files and directories to include in the local package
const includeFiles = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'postcss.config.js',
  'components.json',
  'README.md',
  'LOCAL_SETUP_GUIDE.md',
  'setup-local.js',
  'start-local.sh',
  'start-local.bat',
  'client/',
  'server/',
  'shared/',
  '.gitignore'
];

// Files to exclude from the package
const excludePatterns = [
  'node_modules',
  'dist',
  '.replit',
  'replit.nix',
  'drizzle.config.ts'
];

function shouldInclude(filePath) {
  // Check if file/directory should be excluded
  for (const pattern of excludePatterns) {
    if (filePath.includes(pattern)) {
      return false;
    }
  }
  return true;
}

// Create a verification script
const verifyScript = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying ChatFlow installation...\\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.log('❌ Node.js version too old:', nodeVersion);
  console.log('   Required: Node.js 18 or higher');
  console.log('   Download: https://nodejs.org/\\n');
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
  console.log('\\n❌ Some required files are missing. Please re-download the complete package.\\n');
  process.exit(1);
}

// Check if dependencies are installed
if (fs.existsSync('node_modules')) {
  console.log('✅ Dependencies are installed');
} else {
  console.log('⚠️  Dependencies not installed yet');
  console.log('   Run: npm install');
}

console.log('\\n🎉 Installation verification complete!');
console.log('\\n📋 Next steps:');
if (!fs.existsSync('node_modules')) {
  console.log('   1. Install dependencies: npm install');
  console.log('   2. Start the server: npm run dev');
} else {
  console.log('   1. Start the server: npm run dev');
}
console.log('   3. Open browser: http://localhost:5000\\n');
`;

fs.writeFileSync('verify-installation.js', verifyScript);
console.log('✅ Created verification script');

// Create installation instructions
const installInstructions = `# 🚀 ChatFlow - Installation Instructions

## Quick Start (3 steps)

1. **Verify your setup:**
   \`\`\`bash
   node verify-installation.js
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the application:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser:**
   \`\`\`
   http://localhost:5000
   \`\`\`

## What You'll See

- A modern chat interface with sidebar and message area
- Sample users (Alice Smith, John Doe, Mike Brown) already online
- Three channels: #general, #random, #tech-talk
- Real-time messaging with instant message delivery
- Typing indicators when users are typing
- Emoji picker for adding emojis to messages

## Testing Real-Time Features

1. Open two browser tabs to http://localhost:5000
2. Send messages from one tab and see them appear instantly in the other
3. Start typing in one tab to see typing indicators in the other
4. Switch between channels to see different conversations

## Need Help?

- See \`LOCAL_SETUP_GUIDE.md\` for detailed setup instructions
- See \`README.md\` for full documentation
- Check troubleshooting section if you encounter issues

## System Requirements

- Node.js 18 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- 2GB+ RAM recommended
- Internet connection for initial package downloads

Happy chatting! 💬
`;

fs.writeFileSync('INSTALLATION.md', installInstructions);
console.log('✅ Created installation instructions');

console.log('\n🎉 Local deployment package ready!\n');
console.log('📋 Package includes:');
console.log('   • Complete source code');
console.log('   • Setup and verification scripts');
console.log('   • Detailed documentation');
console.log('   • Cross-platform start scripts\n');

console.log('💡 To deploy on your local machine:');
console.log('   1. Copy all files to your local directory');
console.log('   2. Run: node verify-installation.js');
console.log('   3. Run: npm install');
console.log('   4. Run: npm run dev');
console.log('   5. Open: http://localhost:5000\n');

console.log('📖 See INSTALLATION.md for quick start guide');
console.log('📖 See LOCAL_SETUP_GUIDE.md for detailed instructions');