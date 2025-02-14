import { useWindowSize } from "usehooks-ts";

import { ModelSelector } from "@/components/model-selector";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon, SpinnerIcon, CheckCircleIcon } from "@/components/icons";
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
}

function PureChatHeader({
  selectedModelId,
  onModelSelect,
  modelStatus,
}: ChatHeaderProps) {
  const { width: windowWidth } = useWindowSize();
  const isLoading =
    modelStatus.includes("Loading") || modelStatus.includes("Initializing");
  const isReady = modelStatus.includes("ready");

  return (
    <header className="bg-background border-b px-4 py-2 flex items-center gap-2">
      <SidebarToggle />
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
