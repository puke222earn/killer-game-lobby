import { useEffect, useState, useRef } from "react";
import { Trophy, Skull, Home, RotateCcw } from "lucide-react";
import { avatarColor, initials, useGame } from "@/lib/game-store";
import { Button } from "@/components/ui/button";

export function EndScreen() {
  const { standings, mySocketId, leaveToHome, playAgain, rematchStatus, rematchDeadline } = useGame();
  const [hasVoted, setHasVoted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15);

  const leaveToHomeRef = useRef(leaveToHome);
  useEffect(() => {
    leaveToHomeRef.current = leaveToHome;
  }, [leaveToHome]);

  useEffect(() => {
    if (!rematchDeadline) return;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((rematchDeadline - Date.now()) / 1000));
      setSecondsLeft(remaining);

      if (remaining === 0 && !hasVoted) {
        leaveToHomeRef.current();
      }
    };

    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [rematchDeadline, hasVoted]);

  const handlePlayAgain = () => {
    playAgain();
    setHasVoted(true);
  };

  const winner = standings[0];
  const rest = standings.slice(1);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/15 text-primary">
          <Trophy className="size-8" />
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight">Game Over</h1>
        <p className="mt-1 text-sm text-muted-foreground">Final standings</p>
      </div>

      {winner && (
        <div className="rounded-3xl bg-primary/10 p-6 text-center ring-1 ring-primary/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Winner</p>
          <div className="mt-3 flex flex-col items-center gap-2">
            <div
              className="flex size-16 items-center justify-center rounded-full text-lg font-bold text-background shadow-lg"
              style={{ backgroundColor: avatarColor(winner.socketId || winner.name) }}
            >
              {initials(winner.name)}
            </div>
            <p className="text-xl font-bold">
              {winner.name}
              {winner.socketId === mySocketId && (
                <span className="ml-1.5 text-sm font-normal text-muted-foreground">(you)</span>
              )}
            </p>
            <div className="flex items-center gap-1.5 text-primary">
              <Skull className="size-4" />
              <span className="font-mono text-lg font-bold">{winner.kills}</span>
              <span className="text-sm text-muted-foreground">kill{winner.kills === 1 ? "" : "s"}</span>
            </div>
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="space-y-2">
          {rest.map((player, index) => (
            <div key={player.socketId} className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 ring-1 ring-border">
              <span className="w-5 text-center font-mono text-sm font-bold text-muted-foreground">{index + 2}</span>
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-background"
                style={{ backgroundColor: avatarColor(player.socketId || player.name) }}
              >
                {initials(player.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{player.name}</span>
                  {player.socketId === mySocketId && <span className="text-xs text-muted-foreground">(you)</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Skull className="size-3.5" />
                <span className="font-mono text-sm font-semibold">{player.kills}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {rematchStatus && rematchStatus.votedCount > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {rematchStatus.votedCount} of {rematchStatus.totalCount} players agreed to play again
        </p>
      )}

      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="h-12 flex-1 text-base"
          onClick={leaveToHome}
          disabled={hasVoted}
        >
          <Home className="size-4" /> Going home in {secondsLeft}s
        </Button>
        <Button
          className="h-12 flex-1 text-base"
          onClick={handlePlayAgain}
          disabled={hasVoted}
        >
          <RotateCcw className="size-4" /> {hasVoted ? "Waiting for others…" : "Play Again"}
        </Button>
      </div>
    </div>
  );
}