import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { GameProvider, useGame } from "@/lib/game-store";
import { NameScreen } from "@/components/lobby/NameScreen";
import { HomeScreen } from "@/components/lobby/HomeScreen";
import { LobbyScreen } from "@/components/lobby/LobbyScreen";

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
      {screen === "name" && <NameScreen />}
      {screen === "home" && <HomeScreen />}
      {screen === "lobby" && <LobbyScreen />}
    </main>
  );
}

function Index() {
  return (
    <GameProvider>
      <Screens />
      <Toaster position="top-center" />
    </GameProvider>
  );
}
