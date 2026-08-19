import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

export type Player = {
  socketId: string;
  name: string;
  ready?: boolean;
  isHost?: boolean;
};

export type Room = {
  roomId: string;
  hostId: string;
  status: string;
  players: Player[];
};

type ServerMessage = {
  action: string;
  result?: "success" | "failure";
  payload?: any;
  reason?: string;
};

export type Screen = "name" | "home" | "lobby";

type GameState = {
  screen: Screen;
  connected: boolean;
  connecting: boolean;
  name: string;
  mySocketId: string | null;
  room: Room | null;
  error: string | null;
  busy: boolean;
  isHost: boolean;
  setName: (serverUrl: string, name: string) => void;
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  toggleReady: () => void;
  kickPlayer: (socketId: string) => void;
  startGame: () => void;
  leaveToHome: () => void;
  clearError: () => void;
};

const Ctx = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [screen, setScreen] = useState<Screen>("name");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [name, setNameState] = useState("");
  const [mySocketId, setMySocketId] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const send = useCallback((action: string, payload?: unknown) => {
    socketRef.current?.emit("message", payload ? { action, payload } : { action });
  }, []);

  const handleMessage = useCallback((msg: ServerMessage) => {
    const { action, payload, reason } = msg ?? {};
    switch (action) {
      case "NAME_SET":
        setBusy(false);
        setScreen("home");
        if (payload?.socketId) setMySocketId(payload.socketId);
        break;
      case "ROOM_CREATED":
      case "ROOM_JOINED":
        setBusy(false);
        setError(null);
        setRoom({
          roomId: payload.roomId,
          hostId: payload.hostId,
          status: payload.status,
          players: payload.players ?? [],
        });
        setScreen("lobby");
        break;
      case "PLAYER_JOINED":
        setRoom((r) =>
          r && payload?.player
            ? r.players.some((p) => p.socketId === payload.player.socketId)
              ? r
              : { ...r, players: [...r.players, payload.player] }
            : r,
        );
        break;
      case "PLAYER_LEFT":
      case "PLAYER_DISCONNECTED":
        setRoom((r) =>
          r ? { ...r, players: r.players.filter((p) => p.socketId !== payload?.socketId) } : r,
        );
        if (payload?.name) toast(`${payload.name} left the room`);
        break;
      case "HOST_CHANGED":
        setRoom((r) => (r ? { ...r, hostId: payload.newHostId } : r));
        if (payload?.newHostName) toast(`${payload.newHostName} is now the host`);
        break;
      case "PLAYER_READY_TOGGLED":
        setRoom((r) =>
          r
            ? {
                ...r,
                players: r.players.map((p) =>
                  p.socketId === payload?.socketId ? { ...p, ready: payload.ready } : p,
                ),
              }
            : r,
        );
        break;
      case "KICKED":
        setRoom(null);
        setScreen("home");
        toast("You were removed from the room");
        break;
      case "GAME_STARTED":
        toast("Game starting!");
        setRoom((r) => (r ? { ...r, status: "in_progress" } : r));
        break;
      case "ERROR":
        setBusy(false);
        setError(reason ?? "Something went wrong");
        break;
      default:
        if (msg?.result === "failure") {
          setBusy(false);
          setError(reason ?? "Something went wrong");
        }
    }
  }, []);

  const setName = useCallback(
    (serverUrl: string, playerName: string) => {
      setError(null);
      setBusy(true);
      setNameState(playerName);

      const url = serverUrl.trim().replace(/^ws:\/\//, "http://").replace(/^wss:\/\//, "https://");

      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }

      setConnecting(true);
      const socket = io(url, { transports: ["websocket"], forceNew: true });
      socketRef.current = socket;

      socket.on("connect", () => {
        setConnected(true);
        setConnecting(false);
        setMySocketId(socket.id ?? null);
        socket.emit("message", { action: "SET_NAME", payload: { name: playerName } });
      });
      socket.on("disconnect", () => setConnected(false));
      socket.on("connect_error", (err) => {
        setConnecting(false);
        setBusy(false);
        setError(`Could not connect to ${url} (${err.message})`);
      });
      socket.on("message", handleMessage);
    },
    [handleMessage],
  );

  const isHost = !!room && !!mySocketId && room.hostId === mySocketId;

  const value = useMemo<GameState>(
    () => ({
      screen,
      connected,
      connecting,
      name,
      mySocketId,
      room,
      error,
      busy,
      isHost,
      setName,
      createRoom: () => {
        setError(null);
        setBusy(true);
        send("CREATE_ROOM");
      },
      joinRoom: (roomId: string) => {
        setError(null);
        setBusy(true);
        send("JOIN_ROOM", { roomId });
      },
      toggleReady: () => send("TOGGLE_READY"),
      kickPlayer: (socketId: string) => send("KICK_PLAYER", { socketId }),
      startGame: () => send("START_GAME"),
      leaveToHome: () => {
        send("LEAVE_ROOM");
        setRoom(null);
        setScreen("home");
      },
      clearError: () => setError(null),
    }),
    [screen, connected, connecting, name, mySocketId, room, error, busy, isHost, setName, send],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

export function avatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 360;
  return `oklch(0.68 0.17 ${hash})`;
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
