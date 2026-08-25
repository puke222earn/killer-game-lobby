import { useEffect, useState, useRef } from "react";

const STATS_URL = "https://kill-your-friend.duckdns.org/api/stats";

const VISIT_URL = "https://kill-your-friend.duckdns.org/api/visit";

export function useSiteStats() {
  const [online, setOnline] = useState<number | null>(null);

  const [totalVisits, setTotalVisits] = useState<number | null>(null);

  const hasFiredVisit = useRef(false);

  useEffect(() => {
    if (!hasFiredVisit.current) {
      hasFiredVisit.current = true;

      fetch(VISIT_URL).catch(() => {}); // fire-and-forget, registers this page load
    }

    const fetchStats = () => {
      fetch(STATS_URL)
        .then((res) => res.json())
        .then((data) => {
          setOnline(data.online);

          setTotalVisits(data.totalVisits);
        })
        .catch(() => {});
    };

    fetchStats();

    const interval = setInterval(fetchStats, 15000); // refresh every 15s for live feel

    return () => clearInterval(interval);
  }, []);

  return { online, totalVisits };
}
