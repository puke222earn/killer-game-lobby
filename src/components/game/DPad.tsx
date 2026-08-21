import { useRef, useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type Direction = "up" | "down" | "left" | "right";

export function DPad({ onMove }: { onMove: (direction: Direction) => void }) {
  const intervalRef = useRef<number | null>(null);

  const startMoving = useCallback(
    (direction: Direction) => {
      onMove(direction); // fire immediately on press, don't wait for the interval
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        onMove(direction);
      }, 150); // matches the server's move cooldown
    },
    [onMove],
  );

  const stopMoving = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const buttonClass =
    "flex size-12 items-center justify-center rounded-xl bg-card/80 text-foreground ring-1 ring-border backdrop-blur-sm active:bg-primary/20 select-none touch-none";

  return (
    <div className="pointer-events-auto fixed bottom-6 right-6 z-30 grid grid-cols-3 grid-rows-3 gap-1">
      <div />
      <button
        className={buttonClass}
        style={{ gridColumn: 2, gridRow: 1 }}
        onPointerDown={() => startMoving("up")}
        onPointerUp={stopMoving}
        onPointerLeave={stopMoving}
        onPointerCancel={stopMoving}
      >
        <ChevronUp className="size-6" />
      </button>

      <button
        className={buttonClass}
        style={{ gridColumn: 1, gridRow: 2 }}
        onPointerDown={() => startMoving("left")}
        onPointerUp={stopMoving}
        onPointerLeave={stopMoving}
        onPointerCancel={stopMoving}
      >
        <ChevronLeft className="size-6" />
      </button>

      <div style={{ gridColumn: 2, gridRow: 2 }} />

      <button
        className={buttonClass}
        style={{ gridColumn: 3, gridRow: 2 }}
        onPointerDown={() => startMoving("right")}
        onPointerUp={stopMoving}
        onPointerLeave={stopMoving}
        onPointerCancel={stopMoving}
      >
        <ChevronRight className="size-6" />
      </button>

      <button
        className={buttonClass}
        style={{ gridColumn: 2, gridRow: 3 }}
        onPointerDown={() => startMoving("down")}
        onPointerUp={stopMoving}
        onPointerLeave={stopMoving}
        onPointerCancel={stopMoving}
      >
        <ChevronDown className="size-6" />
      </button>
    </div>
  );
}