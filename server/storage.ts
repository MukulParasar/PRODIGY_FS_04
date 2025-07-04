import { 
  users, 
  channels, 
  messages, 
  type User, 
  type InsertUser, 
  type Channel, 
  type InsertChannel, 
  type Message, 
  type InsertMessage, 
  type MessageWithUser,
  type ChannelWithMessageCount 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStatus(id: number, status: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Channels
  getChannel(id: number): Promise<Channel | undefined>;
  getChannelByName(name: string): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  getAllChannels(): Promise<ChannelWithMessageCount[]>;
  
  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByChannel(channelId: number, limit?: number): Promise<MessageWithUser[]>;
  deleteMessage(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private channels: Map<number, Channel>;
  private messages: Map<number, Message>;
  private currentUserId: number;
  private currentChannelId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.channels = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentChannelId = 1;
    this.currentMessageId = 1;
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Create default channels
    const generalChannel = await this.createChannel({
      name: "general",
      description: "General discussion"
    });
    
    await this.createChannel({
      name: "random",
      description: "Random conversations"
    });
    
    await this.createChannel({
      name: "tech-talk",
      description: "Technical discussions"
    });

    // Create default users
    const alice = await this.createUser({
      username: "Alice Smith",
      avatar: "AS",
      status: "online"
    });

    const john = await this.createUser({
      username: "John Doe", 
      avatar: "JD",
      status: "online"
    });

    const mike = await this.createUser({
      username: "Mike Brown",
      avatar: "MB", 
      status: "away"
    });

    // Create some initial messages
    await this.createMessage({
      content: "Hey everyone! How's everyone doing today? 👋",
      userId: alice.id,
      channelId: generalChannel.id
    });

    await this.createMessage({
      content: "That sounds awesome! Can't wait to see what you've been working on. Any sneak peeks? 👀",
      userId: john.id,
      channelId: generalChannel.id
    });

    await this.createMessage({
      content: "Also, did anyone see the new design updates? They look incredible! 🎨",
      userId: john.id,
      channelId: generalChannel.id
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      status: insertUser.status || "online",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStatus(id: number, status: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, status };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Channels
  async getChannel(id: number): Promise<Channel | undefined> {
    return this.channels.get(id);
  }

  async getChannelByName(name: string): Promise<Channel | undefined> {
    return Array.from(this.channels.values()).find(
      (channel) => channel.name === name,
    );
  }

  async createChannel(insertChannel: InsertChannel): Promise<Channel> {
    const id = this.currentChannelId++;
    const channel: Channel = { 
      ...insertChannel, 
      id, 
      description: insertChannel.description || null,
      createdAt: new Date()
    };
    this.channels.set(id, channel);
    return channel;
  }

  async getAllChannels(): Promise<ChannelWithMessageCount[]> {
    const channelsArray = Array.from(this.channels.values());
    return channelsArray.map(channel => {
      const messageCount = Array.from(this.messages.values())
        .filter(msg => msg.channelId === channel.id).length;
      return {
        ...channel,
        unreadCount: messageCount > 3 ? Math.floor(Math.random() * 5) + 1 : undefined
      };
    });
  }

  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesByChannel(channelId: number, limit: number = 50): Promise<MessageWithUser[]> {
    const channelMessages = Array.from(this.messages.values())
      .filter(msg => msg.channelId === channelId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(-limit);

    return channelMessages.map(message => {
      const user = this.users.get(message.userId);
      return {
        ...message,
        user: user!
      };
    });
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }
}

export const storage = new MemStorage();
