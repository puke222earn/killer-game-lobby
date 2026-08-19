import { useEffect, useMemo, useState } from "react";
import { Skull } from "lucide-react";
import { avatarColor, initials, useGame, type GamePlayer } from "@/lib/game-store";

function formatMs(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function GameScreen() {
  const { game, mySocketId, isKiller } = useGame();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { rows, cols, remainingMs } = useMemo(() => {
    const rows = game?.grid.length ?? 0;
    const cols = game?.grid[0]?.length ?? 0;
    const endAt = (game?.startedAt ?? 0) + (game?.durationMs ?? 0);
    const remainingMs = Math.max(0, endAt - now);
    return { rows, cols, remainingMs };
  }, [game, now]);

  if (!game) return null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between rounded-3xl bg-card px-5 py-4 ring-1 ring-border">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Time left
          </p>
          <p
            className={`font-mono text-3xl font-black tracking-tight ${
              remainingMs <= 10000 ? "text-destructive" : "text-foreground"
            }`}
          >
            {formatMs(remainingMs)}
          </p>
        </div>
        {isKiller && (
          <div className="rounded-full bg-destructive/15 p-2 text-destructive ring-1 ring-destructive/30">
            <Skull className="size-5" />
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-card p-2 ring-1 ring-border">
        <div
          className="relative grid gap-px overflow-hidden rounded-2xl bg-border"
          style={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ["--cols" as any]: cols,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ["--rows" as any]: rows,
            gridTemplateColumns: "repeat(var(--cols), minmax(0, 1fr))",
            gridTemplateRows: "repeat(var(--rows), minmax(0, 1fr))",
          }}
        >
          {game.grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`cell-${r}-${c}`}
                className={`aspect-square ${
                  cell === 0 ? "bg-background" : "bg-muted/50"
                }`}
              />
            )),
          )}

          {game.players.map((player) => (
            <PlayerToken
              key={player.socketId}
              player={player}
              isMe={player.socketId === mySocketId}
              isKiller={isKiller && player.socketId === mySocketId}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {game.players.length} player{game.players.length === 1 ? "" : "s"} in the maze
      </p>
    </div>
  );
}

function PlayerToken({
  player,
  isMe,
  isKiller,
}: {
  player: GamePlayer;
  isMe: boolean;
  isKiller: boolean;
}) {
  return (
    <div
      className="pointer-events-none z-10 flex items-center justify-center"
      style={{
        gridColumn: player.pos.col + 1,
        gridRow: player.pos.row + 1,
      }}
    >
      <div
        className={`relative flex size-[70%] items-center justify-center rounded-full text-[0.6rem] font-bold text-background shadow ${
          isMe
            ? isKiller
              ? "ring-2 ring-destructive ring-offset-1 ring-offset-background"
              : "ring-2 ring-accent ring-offset-1 ring-offset-background"
            : ""
        }`}
        style={{
          backgroundColor: avatarColor(player.socketId || player.name),
          boxShadow: isMe ? `0 0 12px ${isKiller ? "oklch(0.65 0.22 22 / 0.5)" : "oklch(0.82 0.16 90 / 0.5)"}` : undefined,
        }}
      >
        {initials(player.name)}
        {isKiller && (
          <span className="absolute -right-0.5 -top-0.5 rounded-full bg-destructive p-0.5 text-destructive-foreground">
            <Skull className="size-2.5" />
          </span>
        )}
      </div>
    </div>
  );
}
