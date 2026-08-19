import { useEffect, useState } from "react";
import { Skull } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function NameScreen() {
  const { setName, busy, connecting, error } = useGame();
  const [name, setNameInput] = useState("");
  const [server, setServer] = useState("ws://localhost:3001");

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    const savedServer = localStorage.getItem("serverUrl");
    if (savedName) setNameInput(savedName);
    if (savedServer) setServer(savedServer);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem("playerName", name.trim());
    localStorage.setItem("serverUrl", server.trim());
    setName(server, name.trim());
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/15 text-primary">
          <Skull className="size-8" />
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight">Killer Game</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick a name and join the hunt.</p>
      </div>

      <div className="space-y-4 rounded-3xl bg-card p-5 ring-1 ring-border">
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            value={name}
            maxLength={20}
            autoComplete="off"
            placeholder="e.g. Alex"
            onChange={(e) => setNameInput(e.target.value)}
            className="h-12 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="server">Server address</Label>
          <Input
            id="server"
            value={server}
            spellCheck={false}
            autoCapitalize="none"
            onChange={(e) => setServer(e.target.value)}
            className="h-12 font-mono text-sm"
          />
        </div>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" className="h-12 w-full text-base" disabled={!name.trim() || busy}>
          {connecting ? "Connecting…" : busy ? "Please wait…" : "Continue"}
        </Button>
      </div>
    </form>
  );
}
