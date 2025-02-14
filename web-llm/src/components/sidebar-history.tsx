"use client";

import { isToday, isYesterday, subMonths, subWeeks, format } from "date-fns";
import { useParams, useNavigate, useLocation } from "react-router";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";
import {
  CheckCircleFillIcon,
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  ShareIcon,
  TrashIcon,
} from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { db } from "@/lib/db";
import type { Chat } from "@/lib/db";

const ChatItem = memo(({ chat, isActive }: { chat: Chat; isActive: boolean }) => {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await db.deleteChat(chat.id);
    if (isActive) {
      navigate("/chat");
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        onClick={() => setOpenMobile(false)}
      >
        <a href={`/chat/${chat.id}`}>
          <span className="truncate">{chat.title}</span>
          <span className="text-xs text-muted-foreground">
            {format(chat.updatedAt, 'MMM d, h:mm a')}
          </span>
        </a>
      </SidebarMenuButton>

      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleDelete}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
});

export function SidebarHistory() {
  const { chatId } = useParams();
  const chats = useLiveQuery(() => db.getChats());

  if (!chats?.length) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-muted-foreground text-center text-sm">
            Your chat history will appear here
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === chatId}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
