import { Message } from "ai";
import { memo } from "react";
import { PreviewMessage, ThinkingMessage } from "./message";
import { Overview } from "./overview";

interface MessagesProps {
  messages: Array<Message>;
  isLoading: boolean;
}

function PureMessages({ messages, isLoading }: MessagesProps) {
  return (
    <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4 pb-16">
      {messages.length === 0 && <Overview />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          message={message}
          isLoading={isLoading && messages.length - 1 === index}
        />
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}
    </div>
  );
}

export const Messages = memo(PureMessages);
