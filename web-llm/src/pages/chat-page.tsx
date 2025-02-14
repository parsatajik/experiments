import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { CreateWebWorkerMLCEngine, MLCEngineInterface } from "@mlc-ai/web-llm";
import { ChatHeader } from "@/components/chat-header";
import { MultimodalInput } from "@/components/multimodal-input";
import MarkdownRenderer from "@/components/markdown-renderer";
import { chatModels } from "@/lib/models";
import { useChat } from "@/hooks/use-chat";
import { db } from "@/lib/db";
import Cookies from "js-cookie";

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<string>("");
  const engineRef = useRef<MLCEngineInterface | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);

  const [selectedModelId, setSelectedModelId] = useState(() => {
    return Cookies.get("selected-model") || chatModels[0].id;
  });

  const { chat, messages, addMessage, updateMessageStream, updateTitle } =
    useChat(chatId || "");

  // Create new chat if we don't have a chatId
  useEffect(() => {
    async function createNewChat() {
      if (!chatId) {
        const newChat = await db.createChat(selectedModelId);
        navigate(`/chat/${newChat.id}`);
      }
    }
    createNewChat();
  }, [chatId, navigate, selectedModelId]);

  // Scroll handling
  useEffect(() => {
    if (shouldScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
      ) < 50;
    shouldScrollRef.current = isAtBottom;
  };

  // Model initialization
  useEffect(() => {
    async function initEngine() {
      try {
        setModelStatus("Initializing model...");
        const engine = await CreateWebWorkerMLCEngine(
          new Worker(new URL("../worker-v2.ts", import.meta.url), {
            type: "module",
          }),
          selectedModelId,
          {
            initProgressCallback: (progress) => {
              setModelStatus(
                `Loading model: ${Math.round(progress.progress * 100)}%`
              );
            },
          }
        );
        engineRef.current = engine;
        setModelStatus("Model ready!");
      } catch (error) {
        console.error("Failed to initialize engine:", error);
        setModelStatus("Failed to load model");
      }
    }

    initEngine();
  }, [selectedModelId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !engineRef.current || !chat) return;

    // Add user message immediately
    const userMessage = await addMessage("user", message);
    setMessage("");
    setIsLoading(true);
    shouldScrollRef.current = true;

    try {
      const chatHistory = [...messages, userMessage].map((msg) => ({
        role: msg!.role as "user" | "assistant",
        content: msg!.content,
      }));

      const response = await engineRef.current.chat.completions.create({
        messages: chatHistory,
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      });

      let fullContent = "";
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullContent += content;
        // Update UI with streaming content
        updateMessageStream(fullContent);
      }
      // Persist the complete message
      await addMessage("assistant", fullContent);
    } catch (error) {
      console.error("Chat error:", error);
      await addMessage("assistant", "Error: Failed to generate response");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader
        selectedModelId={selectedModelId}
        onModelSelect={async (id) => {
          setSelectedModelId(id);
          const newChat = await db.createChat(id);
          navigate(`/chat/${newChat.id}`);
        }}
        modelStatus={modelStatus}
        title={chat?.title || "New Chat"}
        onUpdateTitle={updateTitle}
      />

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === "user"
                  ? "bg-primary text-secondary"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {msg.role === "assistant" ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mx-auto px-4 bg-background pb-4 md:pb-6 w-full md:max-w-3xl">
        <MultimodalInput
          input={message}
          setInput={setMessage}
          isLoading={isLoading}
          onSubmit={sendMessage}
          disabled={!engineRef.current}
        />
      </div>
    </div>
  );
}
