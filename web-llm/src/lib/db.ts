import Dexie, { type Table } from "dexie";

export interface Chat {
  id: string;
  title: string;
  modelId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export class ChatDatabase extends Dexie {
  chats!: Table<Chat>;
  messages!: Table<Message>;

  constructor() {
    super("chatdb");
    this.version(1).stores({
      chats: "id, modelId, createdAt, updatedAt",
      messages: "id, chatId, role, createdAt",
    });
  }

  async createChat(modelId: string): Promise<Chat> {
    const chat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      modelId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.chats.add(chat);
    return chat;
  }

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    await this.chats.update(chatId, {
      title,
      updatedAt: new Date(),
    });
  }

  async addMessage(
    chatId: string,
    role: "user" | "assistant",
    content: string
  ): Promise<Message> {
    const message: Message = {
      id: crypto.randomUUID(),
      chatId,
      role,
      content,
      createdAt: new Date(),
    };
    await this.messages.add(message);
    return message;
  }

  async getChatMessages(chatId: string): Promise<Message[]> {
    return await this.messages
      .where("chatId")
      .equals(chatId)
      .sortBy("createdAt");
  }

  async getChats(): Promise<Chat[]> {
    return await this.chats.orderBy("updatedAt").reverse().toArray();
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.transaction("rw", this.chats, this.messages, async () => {
      await this.messages.where("chatId").equals(chatId).delete();
      await this.chats.delete(chatId);
    });
  }
}

export const db = new ChatDatabase();
