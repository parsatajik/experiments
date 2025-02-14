import { useState } from "react";
import { useWindowSize } from "usehooks-ts";

import { ModelSelector } from "@/components/model-selector";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusIcon,
  SpinnerIcon,
  CheckCircleIcon,
  PenIcon,
} from "@/components/icons";
import { useSidebar } from "@/components/ui/sidebar";
import { memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatHeaderProps {
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
  modelStatus: string;
  title: string;
  onUpdateTitle: (title: string) => void;
}

function PureChatHeader({
  selectedModelId,
  onModelSelect,
  modelStatus,
  title,
  onUpdateTitle,
}: ChatHeaderProps) {
  const { width: windowWidth } = useWindowSize();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const isLoading =
    modelStatus.includes("Loading") || modelStatus.includes("Initializing");
  const isReady = modelStatus.includes("ready");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTitle = editedTitle.trim();
    if (newTitle) {
      onUpdateTitle(newTitle);
      setIsEditing(false);
    }
  };

  return (
    <header className="bg-background border-b px-4 py-2 flex items-center gap-2">
      <SidebarToggle />
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex-1 max-w-[200px]">
          <Input
            autoFocus
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSubmit}
            className="h-8"
          />
        </form>
      ) : (
        <button
          onClick={() => {
            setIsEditing(true);
            setEditedTitle(title);
          }}
          className="flex items-center gap-2 hover:bg-muted px-2 py-1 rounded-md text-base"
        >
          <span className="font-medium truncate">{title}</span>
          <PenIcon />
        </button>
      )}

      <div className="flex-1" />
      <ModelSelector
        selectedModelId={selectedModelId}
        onModelSelect={onModelSelect}
      />
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            {isLoading ? (
              <SpinnerIcon className="h-4 w-4 animate-spin text-blue-500" />
            ) : isReady ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            ) : null}
          </TooltipTrigger>
          <TooltipContent>Status: {modelStatus}</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
