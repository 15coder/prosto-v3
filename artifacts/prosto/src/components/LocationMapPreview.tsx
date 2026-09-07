import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

type Coordinates = { lat: number; lng: number };

const RESTAURANT_LOCATION: Coordinates = { lat: 35.3311, lng: 40.1407 };

function createCustomerIcon(L: typeof import("leaflet")) {
  return L.divIcon({
    className: "prosto-customer-marker",
    html: `
      <div style="
        width:42px;
        height:42px;
        display:flex;
        align-items:center;
        justify-content:center;
        border:3px solid #111009;
        border-radius:50% 50% 50% 0;
        background:#F5C800;
        box-shadow:0 5px 18px rgba(245,200,0,0.55);
        transform:rotate(-45deg);
      ">
        <span style="transform:rotate(45deg);font-size:19px;line-height:1">●</span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });
}

function createRestaurantIcon(L: typeof import("leaflet")) {
  return L.divIcon({
    className: "prosto-restaurant-marker",
    html: `
      <div style="
        width:20px;
        height:20px;
        border:3px solid #111009;
        border-radius:50%;
        background:#F5C800;
        box-shadow:0 0 0 5px rgba(245,200,0,0.18), 0 3px 12px rgba(0,0,0,0.35);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export default function LocationMapPreview({ coordinates }: { coordinates: Coordinates | null }) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const customerMarkerRef = useRef<import("leaflet").Marker | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let disposed = false;

    if (!mapElementRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      if (disposed || !mapElementRef.current || mapRef.current) return;

      const map = L.map(mapElementRef.current, {
        center: [RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap &copy; CARTO",
      }).addTo(map);

      L.marker([RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng], {
        icon: createRestaurantIcon(L),
      })
        .addTo(map)
        .bindTooltip("مطعم بروستو", {
          direction: "top",
          offset: [0, -8],
          className: "prosto-map-tooltip",
        });

      mapRef.current = map;
      setIsReady(true);
    });

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      customerMarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !mapRef.current) return;

    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      if (!coordinates) {
        customerMarkerRef.current?.remove();
        customerMarkerRef.current = null;
        mapRef.current.setView([RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng], 14, { animate: true });
        return;
      }

      const position: [number, number] = [coordinates.lat, coordinates.lng];
      if (customerMarkerRef.current) {
        customerMarkerRef.current.setLatLng(position);
      } else {
        customerMarkerRef.current = L.marker(position, {
          icon: createCustomerIcon(L),
          zIndexOffset: 1000,
        })
          .addTo(mapRef.current)
          .bindTooltip("موقع التوصيل", {
            direction: "top",
            offset: [0, -36],
            className: "prosto-map-tooltip",
          });
      }

      mapRef.current.setView(position, 16, { animate: true });
    });

    return () => {
      cancelled = true;
    };
  }, [coordinates, isReady]);

  return (
    <div className="relative mb-4 overflow-hidden rounded-2xl border border-primary/25 bg-[#111009] shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
      <div ref={mapElementRef} className="h-[240px] w-full sm:h-[280px]" aria-label="معاينة موقع التوصيل على الخريطة" />
      <div className="pointer-events-none absolute right-3 top-3 z-[400] rounded-full border border-primary/30 bg-[#111009]/90 px-3 py-1.5 text-[11px] font-black text-primary shadow-lg backdrop-blur-md">
        {coordinates ? "موقع التوصيل المحدد" : "ستظهر معاينة موقعك هنا"}
      </div>
      {!coordinates && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[400] bg-gradient-to-t from-[#111009] to-transparent px-4 pb-7 pt-12 text-center text-xs font-bold text-white/75">
          حدد موقعك ليظهر الدبوس هنا
        </div>
      )}
    </div>
  );
}