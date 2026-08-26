import { ArrowLeft } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { Button } from "@/components/ui/button";
import { PlayerRow } from "@/components/lobby/PlayerRow";
import { ChatPanel } from "@/components/chat/ChatPanel";

export function LobbyScreen() {
  const { room, mySocketId, isHost, toggleReady, kickPlayer, startGame, leaveToHome, error } =
    useGame();

  if (!room) return null;

  const me = room.players.find((p) => p.socketId === mySocketId);
  const others = room.players.filter((p) => p.socketId !== room.hostId);
  const allReady = others.length > 0 && others.every((p) => p.ready);

  return (
    <div className="mx-auto flex justify-center w-full max-w-4xl flex-col gap-4 md:flex-row md:items-stretch">
      {/* LEFT: room info, player list, action button */}
      <div className="flex w-full min-w-0 max-w-md flex-col gap-5">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={leaveToHome}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          <span className="text-xs text-muted-foreground">
            {room.players.length} player{room.players.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="rounded-3xl bg-primary/10 p-6 text-center ring-1 ring-primary/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Room code
          </p>
          <p className="mt-2 font-mono text-5xl font-black tracking-[0.2em] text-primary">
            {room.roomId}
          </p>
        </div>

        <div className="space-y-2">
          {room.players.map((p, i) => (
            <PlayerRow
              key={p.socketId ?? i}
              player={p}
              isMe={p.socketId === mySocketId}
              isHost={p.socketId === room.hostId}
              canKick={isHost && p.socketId !== room.hostId}
              onKick={() => kickPlayer(p.socketId)}
            />
          ))}
        </div>

        {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}

        {isHost ? (
          <Button className="h-14 w-full text-base" disabled={!allReady} onClick={startGame}>
            {allReady ? "Start Game" : "Waiting for players to be ready…"}
          </Button>
        ) : (
          <Button
            variant={me?.ready ? "secondary" : "default"}
            className="h-14 w-full text-base"
            onClick={toggleReady}
          >
            {me?.ready ? "Cancel" : "Ready"}
          </Button>
        )}
      </div>

      {/* RIGHT: chat */}
      <ChatPanel className="h-64 w-full md:max-h-[36rem] md:w-80 md:shrink-0" />
    </div>
  );
}