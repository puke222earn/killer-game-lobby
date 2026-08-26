import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { avatarColor, initials, useGame } from "@/lib/game-store";
import { Button } from "@/components/ui/button";

export function ChatPanel({
  className = "",
  collapsible = false,
}: {
  className?: string;
  collapsible?: boolean;
}) {
  const { chatMessages, sendChatMessage, room, mySocketId } = useGame();
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(!collapsible);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatMessages, open]);

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    sendChatMessage(text.slice(0, 200));
    setDraft("");
  }

  if (collapsible && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center justify-center gap-2 rounded-2xl bg-card px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground ring-1 ring-border ${className}`}
      >
        <MessageSquare className="size-4" /> Chat
      </button>
    );
  }

  return (
    <div className={`flex min-h-0 flex-col rounded-3xl bg-card ring-1 ring-border ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <MessageSquare className="size-3.5" /> Chat
        </p>
        {collapsible && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Minimize chat"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div ref={listRef} className="flex-1 min-h-0 space-y-2 overflow-y-auto px-3 py-3">
        {chatMessages.length === 0 && (
          <p className="py-6 text-center text-xs text-muted-foreground">No messages yet.</p>
        )}
        {chatMessages.map((m, i) => {
          const sender = room?.players.find((p) => p.socketId === m.socketId);
          const displayName = sender?.name ?? "Player";
          const isMe = !!mySocketId && m.socketId === mySocketId;
          return (
            <div
              key={`${m.socketId}-${m.timestamp}-${i}`}
              className={`flex items-start gap-2 ${isMe ? "flex-row-reverse" : ""}`}
            >
              <div
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[0.55rem] font-bold text-background"
                style={{ backgroundColor: avatarColor(m.socketId || displayName) }}
              >
                {initials(displayName)}
              </div>
              <div className={`max-w-[75%] ${isMe ? "text-right" : ""}`}>
                <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  {isMe ? "You" : displayName}
                </p>
                <p
                  className={`mt-0.5 inline-block break-words rounded-2xl px-3 py-1.5 text-sm ${
                    isMe
                      ? "bg-primary/20 text-foreground ring-1 ring-primary/30"
                      : "bg-muted/60 text-foreground ring-1 ring-border"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-t border-border p-2">
        <input
          value={draft}
          maxLength={200}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Say something…"
          className="h-9 min-w-0 flex-1 rounded-xl bg-input/60 px-3 text-sm text-foreground outline-none ring-1 ring-border placeholder:text-muted-foreground focus:ring-primary/50"
        />
        <Button size="icon" className="size-9 shrink-0" onClick={handleSend} disabled={!draft.trim()}>
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
