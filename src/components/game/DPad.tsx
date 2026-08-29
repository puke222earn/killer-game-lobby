import { useRef, useCallback, useEffect } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type Direction = "up" | "down" | "left" | "right";

export function DPad({ onMove }: { onMove: (direction: Direction) => void }) {
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const stopMoving = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startMoving = useCallback(
    (direction: Direction) => {
      onMove(direction);
      timeoutRef.current = window.setTimeout(() => {
        intervalRef.current = window.setInterval(() => {
          onMove(direction);
        }, 150);
      }, 300);
    },
    [onMove],
  );

  // Safety net: catch release/interruption events ANYWHERE on the page,
  // and on tab visibility loss — not just on the button itself
  useEffect(() => {
    window.addEventListener("pointerup", stopMoving);
    window.addEventListener("pointercancel", stopMoving);
    window.addEventListener("blur", stopMoving);
    document.addEventListener("visibilitychange", stopMoving);

    return () => {
      window.removeEventListener("pointerup", stopMoving);
      window.removeEventListener("pointercancel", stopMoving);
      window.removeEventListener("blur", stopMoving);
      document.removeEventListener("visibilitychange", stopMoving);
      stopMoving(); // also clean up on unmount
    };
  }, [stopMoving]);

  const buttonClass =
    "flex size-12 items-center justify-center rounded-xl bg-card/80 text-foreground ring-1 ring-border backdrop-blur-sm active:bg-primary/20 select-none touch-none";

  return (
    <div className="pointer-events-auto fixed bottom-6 right-6 z-30 grid grid-cols-3 grid-rows-3 gap-1">
      <div />
      <button className={buttonClass} style={{ gridColumn: 2, gridRow: 1 }} onPointerDown={() => startMoving("up")}>
        <ChevronUp className="size-6" />
      </button>
      <button className={buttonClass} style={{ gridColumn: 1, gridRow: 2 }} onPointerDown={() => startMoving("left")}>
        <ChevronLeft className="size-6" />
      </button>
      <div style={{ gridColumn: 2, gridRow: 2 }} />
      <button className={buttonClass} style={{ gridColumn: 3, gridRow: 2 }} onPointerDown={() => startMoving("right")}>
        <ChevronRight className="size-6" />
      </button>
      <button className={buttonClass} style={{ gridColumn: 2, gridRow: 3 }} onPointerDown={() => startMoving("down")}>
        <ChevronDown className="size-6" />
      </button>
    </div>
  );
}