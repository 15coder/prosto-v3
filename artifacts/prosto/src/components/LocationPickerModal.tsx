import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, X } from "lucide-react";

interface LocationPickerProps {
  onConfirm: (mapsUrl: string, lat: number, lng: number) => void;
  onClose: () => void;
}

const DEFAULT_LOCATION = { lat: 35.3311, lng: 40.1407 };

export default function LocationPickerModal({ onConfirm, onClose }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [coords, setCoords] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng], 15);
    const marker = L.marker([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng], { draggable: true }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    marker.on("dragend", () => {
      const position = marker.getLatLng();
      setCoords({ lat: position.lat, lng: position.lng });
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
    window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      marker.remove();
      map.remove();
      markerRef.current = null;
      mapInstanceRef.current = null;
    };
  }, []);

  const handleConfirm = () => {
    const mapsUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    onConfirm(mapsUrl, coords.lat, coords.lng);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-picker-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-primary/25 bg-[#1b1b1b] p-4 shadow-2xl sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-black">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 id="location-picker-title" className="font-black text-white">
                حدد موقع التوصيل
              </h2>
              <p className="mt-1 text-xs leading-5 text-white/70">
                اسحب الدبوس إلى مكان بيتك بدقة
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-primary"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={mapRef} className="h-[300px] w-full overflow-hidden rounded-2xl" />

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-primary px-4 py-3 font-black text-black transition-transform hover:-translate-y-0.5"
          >
            تأكيد الموقع
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/10 px-4 py-3 font-bold text-white transition-colors hover:bg-white/15"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}