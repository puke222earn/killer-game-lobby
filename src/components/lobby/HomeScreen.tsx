import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HomeScreen() {
  const { name, createRoom, joinRoom, goToLanding, error, busy, connected } = useGame();
  const [code, setCode] = useState("");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={goToLanding} disabled={busy}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        <span className="text-xs text-muted-foreground">
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-black tracking-tight">Hey, {name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          start a room or join one
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-card ring-1 ring-border">
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="flex flex-col justify-center p-5">
            <Button className="h-14 w-full text-base" disabled={busy} onClick={createRoom}>
              <Plus className="size-5" /> Create Room
            </Button>
          </div>

          <div className="flex flex-col justify-center gap-3 p-5">
            <p className="text-sm font-semibold text-muted-foreground">Join with a code</p>
            <Input
              value={code}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="h-14 text-center font-mono text-2xl tracking-[0.4em]"
            />
            <Button
              variant="secondary"
              className="h-12 w-full text-base"
              disabled={code.length !== 6 || busy}
              onClick={() => joinRoom(code)}
            >
              Join
            </Button>
          </div>
        </div>
      </div>

      {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
