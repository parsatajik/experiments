import { useEffect, useRef, useState } from "react";
import { CreateWebWorkerMLCEngine, MLCEngineInterface } from "@mlc-ai/web-llm";
import MarkdownRenderer from "@/components/MarkdownRenderer";

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
    async function initEngine() {
      try {
        setModelStatus("Initializing model...");
        const engine = await CreateWebWorkerMLCEngine(
          new Worker(new URL("../worker-v2.ts", import.meta.url), {
            type: "module",
          }),
          "Llama-3.2-1B-Instruct-q4f32_1-MLC",
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
  }, []);

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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Status bar */}
      <div className="bg-white border-b px-4 py-2 text-sm text-gray-600">
        {modelStatus}
      </div>

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
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {msg.role === "assistant" ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={sendMessage} className="border-t bg-white p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !engineRef.current}
          />
          <button
            type="submit"
            disabled={isLoading || !engineRef.current || !message.trim()}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
