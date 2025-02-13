import { useEffect, useRef, useState } from "react";

function App() {
  const worker = useRef<Worker | null>(null);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse("");

    worker.current?.postMessage({
      message: message,
    });
  };

  useEffect(() => {
    worker.current ??= new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });

    const onMessageReceived = (e: MessageEvent) => {
      console.log("Received message:", e.data); // Debug incoming messages

      if (e.data.status === "complete") {
        setResponse(e.data.output);
        setIsLoading(false);
      } else if (e.data.status === "error") {
        const errorMessage = e.data.error || "Unknown error occurred";
        console.error("Error details:", errorMessage);
        setResponse(`Error: ${errorMessage}`);
        setIsLoading(false);
      } else if (e.data.progress) {
        // Handle model loading progress
        console.log("Loading progress:", e.data.progress);
      }
    };

    worker.current.addEventListener("message", onMessageReceived);

    return () =>
      worker.current?.removeEventListener("message", onMessageReceived);
  }, []);

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} disabled={isLoading}>
        {isLoading ? "Generating..." : "Send"}
      </button>
      {response && (
        <div>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;
