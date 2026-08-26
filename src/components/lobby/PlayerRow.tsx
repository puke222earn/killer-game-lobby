import { Check, Crown, X } from "lucide-react";
import { avatarColor, initials, type Player } from "@/lib/game-store";
import { Button } from "@/components/ui/button";

export function PlayerRow({
  player,
  isHost,
  isMe,
  canKick,
  onKick,
}: {
  player: Player;
  isHost: boolean;
  isMe: boolean;
  canKick: boolean;
  onKick: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[1rem] bg-card px-3 py-3 ring-1 ring-border">
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-background"
        style={{ backgroundColor: avatarColor(player.socketId || player.name) }}
      >
        {initials(player.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold">{player.name}</span>
          {isMe && <span className="text-xs text-muted-foreground">(you)</span>}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs">
          {isHost ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 font-medium text-accent">
              <Crown className="size-3" /> Host
            </span>
          ) : player.ready ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 font-medium text-primary">
              <Check className="size-3" /> Ready
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
              Not ready
            </span>
          )}
        </div>
      </div>
      {canKick && (
        <Button
          size="icon"
          variant="ghost"
          aria-label={`Kick ${player.name}`}
          className="text-muted-foreground hover:text-destructive"
          onClick={onKick}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
