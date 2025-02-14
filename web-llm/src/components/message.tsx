import { Message } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";

import { SparklesIcon } from "./icons";
import { Markdown } from "./markdown";
import { cn } from "@/lib/utils";

const PurePreviewMessage = ({
  message,
  isLoading,
}: {
  message: Message;
  isLoading: boolean;
}) => {
  const isUser = message.role === "user";

  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto max-w-3xl px-4"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className={cn("flex gap-4 w-full", isUser && "flex-row-reverse")}>
          {!isUser && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex flex-col gap-4",
              isUser ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "flex flex-col gap-4 max-w-2xl",
                isUser
                  ? "bg-primary text-primary-foreground px-3 py-2 rounded-xl"
                  : ""
              )}
            >
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(PurePreviewMessage);

export const ThinkingMessage = () => {
  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
    >
      <div className="flex gap-4">
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
