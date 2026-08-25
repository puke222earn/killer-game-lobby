import { useEffect, useState, useRef } from "react";

const STATS_URL = "https://kill-your-friend.duckdns.org/api/stats";

const VISIT_URL = "https://kill-your-friend.duckdns.org/api/visit";

export function useSiteStats() {
  const [online, setOnline] = useState<number>(0);

  const [totalVisits, setTotalVisits] = useState<number>(0);

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
          setOnline(Number(data?.online) || 0);

          setTotalVisits(Number(data?.totalVisits) || 0);
        })
        .catch(() => {
          setOnline(0);
          setTotalVisits(0);
        });
    };

    fetchStats();

    const interval = setInterval(fetchStats, 15000); // refresh every 15s for live feel

    return () => clearInterval(interval);
  }, []);

  return { online, totalVisits };
}

