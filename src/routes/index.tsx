import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { GameProvider, useGame } from "@/lib/game-store";
import { LandingScreen } from "@/components/lobby/LandingScreen";
import { NameScreen } from "@/components/lobby/NameScreen";
import { HomeScreen } from "@/components/lobby/HomeScreen";
import { LobbyScreen } from "@/components/lobby/LobbyScreen";
import { GameScreen } from "@/components/game/GameScreen";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Killer Game — Multiplayer Lobby" },
      {
        name: "description",
        content:
          "Create or join a Killer Game room with a 6-digit code, get everyone ready, and start playing together.",
      },
      { property: "og:title", content: "Killer Game — Multiplayer Lobby" },
      {
        property: "og:description",
        content: "Create or join a room with a 6-digit code and start the Killer Game.",
      },
    ],
  }),
  component: Index,
});

function Screens() {
  const { screen } = useGame();
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-8">
      {screen === "landing" && <LandingScreen />}
      {screen === "name" && <NameScreen />}
      {screen === "home" && <HomeScreen />}
      {screen === "lobby" && <LobbyScreen />}
      {screen === "game" && <GameScreen />}

    </main>
  );
}

function Index() {
  return (
    <GameProvider>
      <Screens />
      <Toaster richColors position="top-center" />
    </GameProvider>
  );
}
