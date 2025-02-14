import { useEffect, useRef, useState } from "react";
import { CreateWebWorkerMLCEngine, MLCEngineInterface } from "@mlc-ai/web-llm";
import { ChatHeader } from "@/components/chat-header";
import MarkdownRenderer from "@/components/markdown-renderer";
import { chatModels } from "@/lib/models";
import Cookies from "js-cookie";
import { MultimodalInput } from "@/components/multimodal-input";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<string>("");
  const engineRef = useRef<MLCEngineInterface | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);
  const [selectedModelId, setSelectedModelId] = useState(() => {
    return Cookies.get("selected-model") || chatModels[0].id;
  });

  // Scroll only if user is at bottom of messages
  const scrollToBottom = () => {
    if (shouldScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track scroll position to determine if auto-scroll should happen
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
      ) < 50;
    shouldScrollRef.current = isAtBottom;
  };

  useEffect(() => {
    Cookies.set("selected-model", selectedModelId, { expires: 365 });
  }, [selectedModelId]);

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
    if (!message.trim() || !engineRef.current) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "" },
    ]);
    setMessage("");
    setIsLoading(true);
    shouldScrollRef.current = true; // Force scroll on new message

    try {
      const response = await engineRef.current.chat.completions.create({
        messages: [...messages, userMessage],
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      });

      // Handle streaming response
      let fullContent = "";
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullContent += content;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          lastMessage.content = fullContent; // Replace entire content instead of appending
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content =
          "Error: Failed to generate response";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader
        selectedModelId={selectedModelId}
        onModelSelect={(id) => {
          setSelectedModelId(id);
          setMessages([]);
        }}
        modelStatus={modelStatus}
      />

      {/* Messages container */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
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

      {/* Input form */}
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