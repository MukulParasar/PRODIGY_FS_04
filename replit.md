# ChatFlow - Real-time Messaging Application

## Overview

ChatFlow is a modern real-time messaging application built with a full-stack TypeScript architecture. It features a React frontend with shadcn/ui components, an Express.js backend, and PostgreSQL database integration using Drizzle ORM. The application provides Discord-like chat functionality with channels, user management, and real-time messaging capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL store
- **Validation**: Zod schemas for request/response validation

### Development Setup
- **Monorepo Structure**: Shared types and schemas between client/server
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **Type Safety**: Full TypeScript coverage across the stack

## Key Components

### Database Schema
Located in `shared/schema.ts`, defines three main entities:
- **Users**: User profiles with username, avatar, status (online/away/offline)
- **Channels**: Chat channels with name and description
- **Messages**: Chat messages linking users to channels

### API Endpoints
- `GET /api/users` - Retrieve all users
- `GET /api/users/me` - Get current user (MVP simulation)
- `POST /api/users` - Create new user
- `PUT /api/users/:id/status` - Update user status
- `GET /api/channels` - Get all channels with message counts
- `POST /api/channels` - Create new channel
- `GET /api/channels/:id/messages` - Get messages for a channel
- `POST /api/messages` - Send new message
- `DELETE /api/messages/:id` - Delete message

### Frontend Components
- **Chat Area**: Main messaging interface with header, message list, and input
- **Sidebar**: Channel navigation and user list with real-time online status
- **Message Components**: Message display with user avatars and timestamps
- **Emoji Picker**: Interactive emoji selection for messages
- **WebSocket Hook**: Custom React hook for real-time Socket.io connection management
- **Typing Indicators**: Live typing status with animated indicators

### Storage Layer
Implements an abstraction layer (`IStorage`) with in-memory implementation for development and easy migration to database storage. Supports all CRUD operations for users, channels, and messages.

## Data Flow

1. **User Authentication**: Currently simulated with a default "current user" for MVP
2. **Channel Selection**: Users select channels from sidebar, triggering message loading
3. **Message Sending**: Messages are sent via WebSocket and broadcast in real-time to all connected clients
4. **Real-time Updates**: Socket.io WebSocket connections provide instant message delivery and typing indicators
5. **State Management**: TanStack Query handles caching with WebSocket events updating the cache in real-time

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework
- **zod**: Runtime type validation and schema definition

### Development Tools
- **vite**: Fast build tool with HMR support
- **tsx**: TypeScript execution for Node.js
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting
- **@replit/vite-plugin-cartographer**: Development tooling integration

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Database Setup**: Drizzle migrations applied to PostgreSQL

### Environment Configuration
- **Development**: Hot reload with tsx and Vite dev server
- **Production**: Optimized builds with static file serving
- **Database**: Environment variable configuration for DATABASE_URL

### Deployment Commands
- `npm run dev`: Development mode with hot reload
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server startup
- `npm run db:push`: Apply database schema changes

## Changelog
- July 04, 2025: Initial setup with polling-based messaging
- July 04, 2025: Upgraded to WebSocket technology using Socket.io for real-time messaging
  - Added Socket.io server integration with room-based channel management
  - Implemented real-time message broadcasting and delivery
  - Added typing indicators with animated UI elements
  - Created custom useSocket React hook for connection management
  - Replaced polling with event-driven real-time updates

## User Preferences

Preferred communication style: Simple, everyday language.