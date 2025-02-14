import type React from "react";
import { type Dispatch, type SetStateAction, memo } from "react";

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MultimodalInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

function PureMultimodalInput({
  input,
  setInput,
  isLoading,
  onSubmit,
  disabled,
  className,
}: MultimodalInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn("relative w-full flex flex-col gap-4", className)}
    >
      <Textarea
        placeholder="Send a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[24px] max-h-[200px] overflow-y-auto resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700"
        disabled={isLoading || disabled}
        rows={1}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (!isLoading && input.trim()) {
              onSubmit(event);
            }
          }
        }}
      />

      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
        <Button
          type="submit"
          className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
          disabled={isLoading || disabled || !input.trim()}
        >
          <ArrowUpIcon size={14} />
        </Button>
      </div>
    </form>
  );
}

export const MultimodalInput = memo(PureMultimodalInput);

function PureAttachmentsButton({
  fileInputRef,
  isLoading,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  isLoading: boolean;
}) {
  return (
    <Button
      className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
      onClick={(event) => {
        event.preventDefault();
        fileInputRef.current?.click();
      }}
      disabled={isLoading}
      variant="ghost"
    >
      <PaperclipIcon size={14} />
    </Button>
  );
}

const AttachmentsButton = memo(PureAttachmentsButton);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
}) {
  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => sanitizeUIMessages(messages));
      }}
    >
      <StopIcon size={14} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
}) {
  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false;
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
