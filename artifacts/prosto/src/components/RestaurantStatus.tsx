import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

const TIME_ZONE = "Asia/Damascus";
const OPEN_MINUTES = 10 * 60;
const CLOSE_MINUTES = 24 * 60;

export const RESTAURANT_HOURS_LABEL = "يومياً من 10:00 صباحاً حتى 12:00 ليلاً";

function getDamascusMinutes() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0) % 24;
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

export function isRestaurantOpen() {
  const minutes = getDamascusMinutes();
  return minutes >= OPEN_MINUTES && minutes < CLOSE_MINUTES;
}

export default function RestaurantStatus() {
  const [isOpen, setIsOpen] = useState(isRestaurantOpen);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsOpen(isRestaurantOpen());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className={`inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold backdrop-blur-md ${
        isOpen
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : "border-red-300/25 bg-red-300/10 text-red-200"
      }`}
      aria-live="polite"
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          isOpen ? "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" : "bg-red-300"
        }`}
      />
      <span>{isOpen ? "مفتوح الآن" : "مغلق الآن"}</span>
      <span className="h-4 w-px bg-current/25" />
      <Clock3 className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{RESTAURANT_HOURS_LABEL}</span>
    </div>
  );
}