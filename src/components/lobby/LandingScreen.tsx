import { useGame } from "@/lib/game-store";
import Lottie from "lottie-react";
import killerRunAnimation from "@/assets/killer-run.json";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function LandingScreen() {
  const { goToName } = useGame();

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