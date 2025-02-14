import { useEffect, useState } from "react";
import { db, type Message, type Chat } from "@/lib/db";

export function useChat(chatId: string) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadChat() {
      if (!chatId) return;
      setIsLoading(true);
      try {
        const [chatData, messagesData] = await Promise.all([
          db.chats.get(chatId),
          db.getChatMessages(chatId),
        ]);
        setChat(chatData || null);
        setMessages(messagesData);
      } catch (error) {
        console.error("Failed to load chat:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadChat();
  }, [chatId]);

  // For immediate UI updates during streaming
  const updateMessageStream = (content: string) => {
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && !lastMessage.id) {
        return [...prev.slice(0, -1), { ...lastMessage, content }];
      }
      return [
        ...prev,
        {
          id: "", // Temporary ID
          chatId: chatId,
          role: "assistant",
          content,
          createdAt: new Date(),
        },
      ];
    });
  };

  // For persisting completed messages
  const addMessage = async (role: "user" | "assistant", content: string) => {
    if (!chat) return;
    const message = await db.addMessage(chat.id, role, content);
    setMessages((prev) => {
      // Replace temporary message if it exists
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && !lastMessage.id) {
        return [...prev.slice(0, -1), message];
      }
      return [...prev, message];
    });
    return message;
  };

  const updateTitle = async (title: string) => {
    if (!chat) return;
    await db.updateChatTitle(chat.id, title);
    setChat((prev) => (prev ? { ...prev, title } : null));
  };

  return {
    chat,
    messages,
    isLoading,
    addMessage,
    updateTitle,
    updateMessageStream,
  };
}
