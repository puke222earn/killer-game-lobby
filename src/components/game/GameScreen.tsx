import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Skull } from "lucide-react";
import { avatarColor, initials, useGame, type GamePlayer } from "@/lib/game-store";
import { GameEvent } from "@/lib/game-store";


function formatMs(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function GameScreen() {
  const { game, mySocketId, isKiller, move, shakeTrigger, gameEvents, deathMarkers } = useGame();
  const [isShaking, setIsShaking] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (shakeTrigger === 0) return; // skip on initial mount
    setIsShaking(true);
    const timeout = setTimeout(() => setIsShaking(false), 300);
    return () => clearTimeout(timeout);
  }, [shakeTrigger]);

  useEffect(() => {
    const keyToDirection: Record<string, string> = {
      ArrowUp: "up",
      KeyW: "up",
      ArrowDown: "down",
      KeyS: "down",
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const direction = keyToDirection[e.code];
      if (!direction || !game) return;

      const currentGame = game; // <-- narrow once, TS now knows this is definitely GameData, not null

      const me = currentGame.players.find((p) => p.socketId === mySocketId);
      if (!me) return;

      const deltas: Record<string, { row: number; col: number }> = {
        up: { row: -1, col: 0 },
        down: { row: 1, col: 0 },
        left: { row: 0, col: -1 },
        right: { row: 0, col: 1 },
      };
      const delta = deltas[direction];
      if (!delta) return;

      const target = { row: me.pos.row + delta.row, col: me.pos.col + delta.col };

      const inBounds =
        target.row >= 0 && target.row < currentGame.grid.length &&
        target.col >= 0 && target.col < currentGame.grid[0]!.length;
      if (!inBounds) return;
      if (currentGame.grid[target.row]![target.col] === 0) return; // wall

      move(direction);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game, mySocketId, move]);

  function GameEventFeed({ events }: { events: GameEvent[] }) {
    return (
      <div className="pointer-events-none absolute inset-x-0 -top-2 z-20 flex -translate-y-full flex-col items-center gap-1.5">
        {events.map((e) => (
          <div
            key={e.id}
            className={`animate-game-toast rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm ${e.variant === "kill"
              ? "border border-destructive/40 bg-destructive/20 text-destructive"
              : e.variant === "killer"
                ? "border border-destructive/60 bg-destructive/30 text-destructive-foreground"
                : "border border-primary/40 bg-primary/20 text-primary"
              }`}
          >
            {e.text}
          </div>
        ))}
      </div>
    );
  }

  const { rows, cols, remainingMs } = useMemo(() => {
    const rows = game?.grid.length ?? 0;
    const cols = game?.grid[0]?.length ?? 0;
    const endAt = (game?.startedAt ?? 0) + (game?.durationMs ?? 0);
    const remainingMs = Math.max(0, endAt - now);
    return { rows, cols, remainingMs };
  }, [game, now]);

  if (!game) return null;

  const MazeWalls = React.memo(function MazeWalls({
    grid,
    rows,
    cols,
  }: {
    grid: number[][];
    rows: number;
    cols: number;
  }) {
    return (
      <div
        className="grid h-full w-full gap-px"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`cell-${r}-${c}`}
              className={cell === 0 ? "bg-background" : "bg-muted/50"}
            />
          )),
        )}
      </div>
    );
  });

  return (
    <div className="mx-auto flex w-full max-w-md sm:max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between rounded-3xl bg-card px-5 py-4 ring-1 ring-border">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Time left
          </p>
          <p
            className={`font-mono text-3xl font-black tracking-tight ${remainingMs <= 10000 ? "text-destructive" : "text-foreground"
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

      <div className="relative">
        <GameEventFeed events={gameEvents} />
        <div className="rounded-3xl bg-card p-2 ring-1 ring-border">
          <div className="relative overflow-hidden rounded-2xl bg-border" style={{ aspectRatio: `${cols} / ${rows}` }}>

            {/* Layer 1: walls */}
            <MazeWalls grid={game.grid} rows={rows} cols={cols} />

            {/* Layer 2: overlay — death markers + players, both absolutely positioned */}
            <div className="absolute inset-0">
              {deathMarkers.map((marker) => (
                <div
                  key={marker.socketId}
                  className="pointer-events-none absolute animate-pulse"
                  style={{
                    left: `${(marker.pos.col / cols) * 100}%`,
                    top: `${(marker.pos.row / rows) * 100}%`,
                    width: `${100 / cols}%`,
                    height: `${100 / rows}%`,
                  }}
                >
                  <div className="size-[50%] rounded-full border-2 border-dashed border-muted-foreground/50" />
                </div>
              ))}

              {game.players.map((player) => (
                <PlayerToken
                  key={player.socketId}
                  player={player}
                  rows={rows}
                  cols={cols}
                  isMe={player.socketId === mySocketId}
                  isKiller={isKiller && player.socketId === mySocketId}
                  isShaking={player.socketId === mySocketId && isShaking}
                />
              ))}
            </div>

          </div>
        </div>
      </div>


      <p className="text-center text-xs text-muted-foreground">
        {game.players.length} player{game.players.length === 1 ? "" : "s"} in the maze
      </p>

      <DPad />
    </div>
  );
}

function PlayerToken({
  player,
  rows,
  cols,
  isMe,
  isKiller,
  isShaking,
}: {
  player: GamePlayer;
  rows: number;
  cols: number;
  isMe: boolean;
  isKiller: boolean;
  isShaking: boolean;
}) {
  if (player.alive === false) return null;
  const leftPct = (player.pos.col / cols) * 100;
  const topPct = (player.pos.row / rows) * 100;
  const cellWidthPct = 100 / cols;
  const cellHeightPct = 100 / rows;

  return (
    <div
      className="pointer-events-none absolute flex items-center justify-center transition-[left,top] duration-150"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: `${cellWidthPct}%`,
        height: `${cellHeightPct}%`,
      }}
    >
      <div
        className={`relative flex size-[70%] items-center justify-center rounded-full text-[0.6rem] font-bold text-background shadow ${isShaking ? "animate-shake" : ""
          } ${isMe
            ? isKiller
              ? "ring-2 ring-destructive ring-offset-1 ring-offset-background"
              : "ring-2 ring-accent ring-offset-1 ring-offset-background"
            : ""
          }`}
        style={{ backgroundColor: avatarColor(player.socketId || player.name) }}
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