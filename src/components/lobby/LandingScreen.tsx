import { Skull } from "lucide-react";
import { useGame } from "@/lib/game-store";

export function LandingScreen() {
  const { goToName } = useGame();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight">Killer Game</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how you want to play
        </p>
      </div>

      <div className="relative">
        <div className="runner-track">
          <div className="runner">
            <Skull className="size-5" />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-card ring-1 ring-border">
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="flex flex-col items-center justify-center gap-2 p-6 opacity-50 grayscale">
              <span className="text-sm font-semibold">Play Online</span>
              <span className="text-xs text-muted-foreground">Coming soon</span>
            </div>

            <button
              type="button"
              onClick={goToName}
              className="group flex flex-col items-center justify-center gap-1 p-6 transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="text-sm font-semibold group-hover:text-primary">Play Locally</span>
              <span className="text-xs text-muted-foreground">Hotspot / LAN party</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
