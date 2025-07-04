# 🚀 ChatFlow - Local Setup Guide

This guide will help you run the ChatFlow chat application on your local machine.

## 📋 What You'll Get

A fully functional real-time chat application with:
- **Real-time messaging** using WebSocket technology
- **Multiple chat channels** (general, random, tech-talk)
- **Typing indicators** that show when users are typing
- **Online/offline user status**
- **Emoji picker** for fun messages
- **Responsive design** that works on mobile and desktop

## 🛠️ Prerequisites

Before you start, make sure you have:
- **Node.js 18 or higher** installed on your computer
- **npm** (comes with Node.js) or **yarn** package manager

### Check Your Node.js Version
```bash
node --version
```
If you need to install or update Node.js, download it from: https://nodejs.org/

## 📦 Quick Installation

### Option 1: Automatic Setup (Recommended)
```bash
# Run the setup script
node setup-local.js

# Install dependencies
npm install

# Start the application
npm run dev
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Option 3: Using Quick Start Scripts
**For Linux/Mac:**
```bash
chmod +x start-local.sh
./start-local.sh
```

**For Windows:**
```batch
start-local.bat
```

## 🌐 Access Your Chat App

Once the server starts, open your web browser and go to:
```
http://localhost:5000
```

You should see the ChatFlow interface with:
- Sidebar showing online users and available channels
- Main chat area with sample messages
- Message input box at the bottom

## 🎯 How to Test Real-Time Features

### Test Messaging
1. Type a message in the input field
2. Press Enter or click the send button
3. Your message appears instantly

### Test Multiple Users
1. Open a second browser tab to `http://localhost:5000`
2. Both tabs represent different users
3. Send messages from one tab and watch them appear in the other
4. Try typing in one tab to see typing indicators in the other

### Test Channels
1. Click on different channels in the sidebar (general, random, tech-talk)
2. Each channel has its own conversation
3. Messages are only visible to users in the same channel

### Test Emoji Picker
1. Click the smile icon next to the message input
2. Select an emoji to add it to your message

## 🔧 Configuration

### Change the Port
If port 5000 is already in use, you can change it:

1. Open `server/index.ts`
2. Change the port number:
   ```typescript
   const PORT = process.env.PORT || 3000; // Change to your preferred port
   ```

3. Update the Socket.io connection (it will automatically use the same port)

### Customize Sample Data
To add more channels or users, edit `server/storage.ts` in the `initializeDefaultData()` function.

## 🚨 Troubleshooting

### Port Already in Use Error
```
Error: listen EADDRINUSE: address already in use 0.0.0.0:5000
```
**Solution:** Either stop the application using port 5000 or change the port in `server/index.ts`.

### Messages Not Appearing in Real-Time
**Check:**
1. Both frontend and backend are running (you should see "User connected" messages in the terminal)
2. No browser console errors (press F12 to check)
3. WebSocket connection is established (should see "Connected to server" in browser console)

### Dependencies Installation Failed
**Try:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Browser Compatibility
The application works best in modern browsers. If you experience issues, try:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📁 Project Structure

```
ChatFlow/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # React hooks (including WebSocket)
│   │   └── pages/          # Page components
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes + Socket.io
│   └── storage.ts         # In-memory data storage
├── shared/                # Shared types between frontend/backend
└── README.md              # Full documentation
```

## 🎨 Customization

### Change the Theme
The app uses Tailwind CSS. You can modify colors in:
- `client/src/index.css` - CSS variables
- `tailwind.config.ts` - Tailwind configuration

### Add New Features
The codebase is well-structured for adding new features:
- Add new Socket.io events in `server/routes.ts`
- Create new React components in `client/src/components/`
- Update types in `shared/schema.ts`

## 🔄 Development Workflow

The application supports hot reload:
- **Frontend changes:** Automatically reload in the browser
- **Backend changes:** Server automatically restarts
- **Type checking:** Full TypeScript support across the stack

## 📱 Mobile Testing

To test on your mobile device:
1. Find your computer's IP address
2. Make sure your mobile device is on the same WiFi network
3. Open `http://YOUR_IP_ADDRESS:5000` on your mobile browser

## 🚀 Production Deployment

For production deployment:
```bash
# Build optimized version
npm run build

# Start production server
npm run start
```

## 📞 Need Help?

If you run into any issues:
1. Check the troubleshooting section above
2. Look at the browser console for error messages (F12)
3. Check the terminal output for server errors
4. Review the full README.md for detailed information

Happy chatting! 💬