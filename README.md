# ChatFlow - Real-time Messaging Application

A modern real-time chat application built with React, Express.js, and Socket.io WebSocket technology.

## Features

- ✅ **Real-time messaging** - Messages appear instantly using WebSocket technology
- ✅ **Multiple channels** - Switch between different chat channels
- ✅ **Typing indicators** - See when other users are typing
- ✅ **User status** - Online/away/offline status indicators
- ✅ **Emoji picker** - Add emojis to your messages
- ✅ **Responsive design** - Works on desktop and mobile
- ✅ **Modern UI** - Clean interface built with Tailwind CSS and shadcn/ui

## Quick Start

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. **Clone or download this project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

That's it! The application will start with sample data and you can immediately begin chatting.

## How to Use

1. **Select a channel** from the sidebar (general, random, tech-talk)
2. **Type your message** in the input field at the bottom
3. **Press Enter or click the send button** to send your message
4. **Click the emoji button** to add emojis to your messages
5. **Watch for typing indicators** when others are typing

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Socket.io Client** - Real-time communication
- **TanStack Query** - Server state management
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **Socket.io** - WebSocket server
- **TypeScript** - Type-safe backend development
- **In-memory storage** - No database required for local development

## Project Structure

```
ChatFlow/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes and Socket.io setup
│   └── storage.ts         # In-memory data storage
├── shared/                # Shared TypeScript types
│   └── schema.ts          # Data models and validation
└── README.md              # This file
```

## Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run preview` - Preview production build locally

## Real-time Features

The application uses Socket.io WebSocket technology for real-time communication:

- **Instant messaging** - Messages appear immediately without page refresh
- **Typing indicators** - Animated dots show when users are typing
- **User status updates** - Real-time online/offline status
- **Channel rooms** - Messages are broadcast only to users in the same channel

## Customization

### Adding New Channels
Channels are created automatically with sample data. To add new channels, modify the `initializeDefaultData()` function in `server/storage.ts`.

### Changing User Information
User data is simulated for local development. The current user is set to "You" with ID 999. Modify this in `server/routes.ts` under the `/api/users/me` endpoint.

### Styling
The application uses Tailwind CSS. Modify styles in the component files or update the theme in `tailwind.config.ts`.

## Development

The application is set up for hot reload development:
- Frontend changes reload automatically via Vite HMR
- Backend changes restart the server automatically via tsx
- TypeScript provides full type safety across the stack

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error, either:
1. Stop other applications using port 5000, or
2. Change the port in `server/index.ts` and update the Socket.io connection URL in `client/src/hooks/use-socket.ts`

### Connection Issues
If messages aren't appearing in real-time:
1. Check that both frontend and backend are running
2. Open browser developer tools and look for WebSocket connection errors
3. Ensure no firewall is blocking the connection

## Production Deployment

For production deployment:
1. Run `npm run build` to create optimized bundles
2. Run `npm run start` to start the production server
3. Configure environment variables for production database if needed

## License

This project is open source and available under the MIT License.