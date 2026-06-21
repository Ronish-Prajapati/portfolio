"use client";

import { useTransition } from "react";
import { Mail, MailOpen, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { toggleMessageRead, deleteMessage } from "@/actions/messages";

interface MessageCardProps {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessageCard({
  id,
  name,
  email,
  message,
  read,
  createdAt,
}: MessageCardProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${
        read ? "border-border bg-card" : "border-accent/40 bg-accent/5"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="font-semibold text-foreground">
            {name}
            {!read && (
              <span className="ml-2 text-xs font-medium text-accent align-middle">● new</span>
            )}
          </p>
          <a href={`mailto:${email}`} className="text-sm text-accent hover:underline">
            {email}
          </a>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              startTransition(async () => {
                await toggleMessageRead(id, !read);
                toast.success(read ? "Marked as unread" : "Marked as read");
              })
            }
            disabled={isPending}
            className="p-2 rounded-md text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
            aria-label={read ? "Mark as unread" : "Mark as read"}
            title={read ? "Mark as unread" : "Mark as read"}
          >
            {read ? <MailOpen size={16} /> : <Mail size={16} />}
          </button>
          <button
            onClick={() =>
              startTransition(async () => {
                await deleteMessage(id);
                toast.success("Message deleted");
              })
            }
            disabled={isPending}
            className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Delete message"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        </div>
      </div>
      <p className="text-muted-foreground whitespace-pre-line mb-3">{message}</p>
      <p className="text-xs text-muted-foreground font-mono">{createdAt}</p>
    </div>
  );
}
