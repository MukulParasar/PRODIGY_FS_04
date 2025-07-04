import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { insertMessageSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all users
  app.get("/api/users", async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get current user (simulated for MVP)
  app.get("/api/users/me", async (_req, res) => {
    try {
      // For MVP, return a default current user
      const currentUser = {
        id: 999,
        username: "You",
        avatar: "ME",
        status: "online",
        createdAt: new Date()
      };
      res.json(currentUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch current user" });
    }
  });

  // Create user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  // Update user status
  app.patch("/api/users/:id/status", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["online", "away", "offline"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const user = await storage.updateUserStatus(userId, status);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  // Get all channels
  app.get("/api/channels", async (_req, res) => {
    try {
      const channels = await storage.getAllChannels();
      res.json(channels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch channels" });
    }
  });

  // Get channel by ID
  app.get("/api/channels/:id", async (req, res) => {
    try {
      const channelId = parseInt(req.params.id);
      const channel = await storage.getChannel(channelId);
      
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }
      
      res.json(channel);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch channel" });
    }
  });

  // Get messages for a channel
  app.get("/api/channels/:id/messages", async (req, res) => {
    try {
      const channelId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      const messages = await storage.getMessagesByChannel(channelId, limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send a message
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      
      // Get the message with user info
      const messageWithUser = await storage.getMessagesByChannel(message.channelId, 1);
      const fullMessage = messageWithUser.find(m => m.id === message.id);
      
      res.status(201).json(fullMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  // Delete a message
  app.delete("/api/messages/:id", async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const deleted = await storage.deleteMessage(messageId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  const httpServer = createServer(app);
  
  // Set up Socket.io
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a channel room
    socket.on('join-channel', (channelId: number) => {
      socket.join(`channel-${channelId}`);
      console.log(`Socket ${socket.id} joined channel ${channelId}`);
    });

    // Leave a channel room
    socket.on('leave-channel', (channelId: number) => {
      socket.leave(`channel-${channelId}`);
      console.log(`Socket ${socket.id} left channel ${channelId}`);
    });

    // Handle new message
    socket.on('send-message', async (data: { content: string; channelId: number; userId: number }) => {
      try {
        const messageData = insertMessageSchema.parse(data);
        const message = await storage.createMessage(messageData);
        
        // Get the message with user info
        const messageWithUser = await storage.getMessagesByChannel(message.channelId, 1);
        const fullMessage = messageWithUser.find(m => m.id === message.id);
        
        if (fullMessage) {
          // Broadcast to all users in the channel
          io.to(`channel-${data.channelId}`).emit('new-message', fullMessage);
        }
      } catch (error) {
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data: { channelId: number; username: string }) => {
      socket.to(`channel-${data.channelId}`).emit('user-typing', { 
        username: data.username,
        isTyping: true 
      });
    });

    socket.on('typing-stop', (data: { channelId: number; username: string }) => {
      socket.to(`channel-${data.channelId}`).emit('user-typing', { 
        username: data.username,
        isTyping: false 
      });
    });

    // Handle user status updates
    socket.on('update-status', async (data: { userId: number; status: string }) => {
      try {
        const user = await storage.updateUserStatus(data.userId, data.status);
        if (user) {
          io.emit('user-status-update', user);
        }
      } catch (error) {
        socket.emit('status-error', { error: 'Failed to update status' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return httpServer;
}
