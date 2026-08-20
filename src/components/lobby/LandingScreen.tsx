import { useGame } from "@/lib/game-store";

function KillerSilhouette() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="killer-silhouette"
      fill="currentColor"
      aria-label="Killer"
    >
      <rect className="leg-left" x="11" y="13" width="2" height="7.5" rx="1" />
      <rect className="leg-right" x="11" y="13" width="2" height="7.5" rx="1" />

      <circle cx="12" cy="5" r="2.8" />
      <rect x="10" y="7" width="4" height="7" rx="1.5" />

      <rect x="9" y="8" width="1.6" height="5" rx="0.8" />

      <g className="knife-arm">
        <path
          d="M13.5 8.5L15.5 13.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M15.5 13.5L18 14.5L16.5 17Z" />
      </g>
    </svg>
  );
}

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
            <KillerSilhouette />
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
