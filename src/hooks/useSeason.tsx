// useSeason.tsx
import { useState } from "react";

export default function useSeason() {
  const [season, setSeason] = useState<
    "spring" | "summer" | "autumn" | "winter"
  >("spring");

  const [dayCount, setDayCount] = useState(0);

  const DAYS_PER_SEASON = 3;

  const nextDay = () => {
    setDayCount((d) => {
      const newDay = d + 1;

      if (newDay >= DAYS_PER_SEASON) {
        setSeason((currentSeason) => {
          const seasons = ["spring", "summer", "autumn", "winter"] as const;
          const currentIndex = seasons.indexOf(currentSeason);
          const nextIndex = (currentIndex + 1) % 4;
          const nextSeason = seasons[nextIndex];
          return nextSeason;
        });
        return 0;
      }

      return newDay;
    });
  };

  return { season, dayCount, nextDay };
}