import { useEffect, useState } from "react";
import { useGame } from "@/lib/game-store";
import { useSiteStats } from "@/hooks/useSiteStats";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function LandingScreen() {
  const { goToName } = useGame();
  const { online, totalVisits } = useSiteStats();
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (online !== null && totalVisits !== null) {
      setShowStats(true);
    }
  }, [online, totalVisits]);


  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto max-w-2xl flex justify-center">
          <DotLottieReact
            src="https://lottie.host/e03711a1-8829-4569-a517-1451db315b0e/Ycpq6FV69C.lottie"
            loop
            autoplay
            style={{ width: "4rem", height: "4rem" }}
          />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Killer Game</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how you want to play
        </p>

        {online !== null && totalVisits !== null && (
          <div
            className={`mt-4 inline-flex items-center gap-2 rounded-full bg-muted/40 px-4 py-1.5 text-sm text-muted-foreground transition-opacity duration-500 ${
              showStats ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            </span>
            <span className="font-semibold text-foreground">{online} online</span>
            <span className="opacity-60">·</span>
            <span>{totalVisits} visitors since launch</span>
            <span className="opacity-60">·</span>
            <span className="hover:text-foreground transition-colors">see stats →</span>
          </div>
        )}
      </div>


      <div className="relative">
        <div className="runner-track">
          {/* <Lottie
              animationData={killerRunAnimation}
              loop
              autoplay
              style={{ width: "2.5rem", height: "2.5rem" }}
            /> */}
        </div>

        <div className="overflow-hidden rounded-3xl bg-card ring-1 ring-border">
          <div className="grid grid-cols-2 divide-x divide-border">
            <button
              type="button"
              onClick={() => goToName("online")}
              className="group flex flex-col items-center justify-center gap-1 p-6 transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="text-sm font-semibold group-hover:text-primary">Play Online</span>
              <span className="text-xs text-muted-foreground">Public server</span>
            </button>

            <button
              type="button"
              onClick={() => goToName("local")}
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