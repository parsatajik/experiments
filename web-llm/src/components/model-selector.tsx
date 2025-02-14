"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { chatModels } from "@/lib/models";
import { cn } from "@/lib/utils";

import { CheckCircleFillIcon, ChevronDownIcon } from "./icons";

interface ModelSelectorProps {
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
  className?: string;
}

export function ModelSelector({
  selectedModelId,
  onModelSelect,
  className,
}: ModelSelectorProps) {
  const selectedModel = chatModels.find((model) => model.id === selectedModelId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground md:px-2 md:h-[34px]",
            className
          )}
        >
          {selectedModel?.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[300px]">
        {chatModels.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => onModelSelect(model.id)}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={model.id === selectedModelId}
          >
            <div className="flex flex-col gap-1 items-start">
              <div>{model.name}</div>
              <div className="text-xs text-muted-foreground">
                {model.description}
              </div>
            </div>
            <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCircleFillIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
