# Killer Game Lobby

Build the frontend for a real-time multiplayer lobby system (a "Killer Game" — 

full gameplay UI comes later, right now I only need the lobby/room flow).

Backend: Socket.IO server, already built, running on ws://<ip>:3001. All 

communication happens over a single Socket.IO event called "message", where 

the payload always has this shape:

{ action: string, result: "success" | "failure", payload: any, reason?: string }

Client sends actions the same way — emit("message", { action, payload }).

SCREENS NEEDED:

1. Name entry screen (first thing shown)

   - Text input for player name, "Continue" button

   - On submit: emit("message", { action: "SET_NAME", payload: { name } })

   - Wait for { action: "NAME_SET" } response before proceeding

2. Home screen (after name is set)

   - Two options: "Create Room" button, or "Join Room" with a 6-digit numeric 

     code input + "Join" button

   - Create: emit("message", { action: "CREATE_ROOM" })

     → listen for { action: "ROOM_CREATED", payload: { roomId, hostId, status, players } }

   - Join: emit("message", { action: "JOIN_ROOM", payload: { roomId } })

     → listen for { action: "ROOM_JOINED", payload: { roomId, hostId, status, players } }

     → also handle { action: "ERROR", reason: "Room not found" } — show inline error

3. Lobby screen (after creating or joining a room)

   - Show the room code prominently (big, easy to read out loud/share)

   - List of all players with: name, ready status (checkmark/badge), host 

     badge if isHost

   - If I am the host: show a "Start Game" button (disabled until all 

     non-host players are ready) and a small "kick" (X) icon next to each 

     non-host player

   - If I am NOT the host: show a "Ready" toggle button for myself instead

   - Listen for these events and update UI live:

     - PLAYER_JOINED → payload: { player: {...} } — add this player to the list

     - PLAYER_LEFT → payload: { socketId, name } — remove player, optionally 

       show a toast "X left the room"

     - PLAYER_DISCONNECTED → same shape as PLAYER_LEFT, handle identically

     - HOST_CHANGED → payload: { newHostId, newHostName } — update host badge, 

       show toast "X is now the host"

     - PLAYER_READY_TOGGLED → payload: { socketId, ready } — update that 

       player's ready badge

   Emitting from this screen:

   - Toggle ready: emit("message", { action: "TOGGLE_READY" })

   - Kick (host only): emit("message", { action: "KICK_PLAYER", payload: { socketId } })

   - Start game (host only): emit("message", { action: "START_GAME" })

DESIGN:

- Dark theme, modern game-lobby aesthetic (think Among Us / Jackbox lobby 

  screens) — bold accent color, rounded cards, avatar circles with player 

  initials in a color derived from their name/socketId

- Mobile-friendly — this will often be opened on phones connecting over a 

  local WiFi hotspot

- Keep it simple and fast — no heavy animations, this needs to feel snappy 

  since it's a real-time app

STATE MANAGEMENT NOTE:

Keep a single source of truth for "current room state" (roomId, players array, 

my own socketId, whether I'm host) that all the above events mutate. Don't 

refetch anything — every event above gives you everything you need to update 

state incrementally.

Use socket.io-client to connect. Server address should be an editable field 

on the very first screen (defaults to something like ws://192.168.1.1:3001) 

since this runs on a local hotspot and the IP changes each time.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7bf093dd-1e87-4927-b5e6-6153a8262f85).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
