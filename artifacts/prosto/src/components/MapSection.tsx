import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Deir ez-Zor — شارع سينما فؤاد، جانب مركز الرشيد
const LAT = 35.3311;
const LNG = 40.1407;
const ZOOM = 16;
const MAPS_URL = 'https://share.google/3GUa6zwSUg2exlBgz';

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    import('leaflet').then((L) => {
      const map = L.map(mapRef.current!, {
        center: [LAT, LNG],
        zoom: ZOOM,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      instanceRef.current = map;

       // OpenStreetMap — free map tiles with no API key
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }
      ).addTo(map);

      // Custom SVG marker
      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            width:44px; height:44px;
            background:#F5C800;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            display:flex; align-items:center; justify-content:center;
            box-shadow:0 4px 20px rgba(245,200,0,0.5);
          ">
            <div style="transform:rotate(45deg); font-size:18px; line-height:1;">🍗</div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
      });

      L.marker([LAT, LNG], { icon })
        .addTo(map)
        .bindPopup(
          `<div dir="rtl" style="font-family:sans-serif;font-size:13px;text-align:right;min-width:160px">
            <strong style="color:#F5C800">مطعم بروستو</strong><br/>
            <span style="color:#888">شارع سينما فؤاد، جانب مركز الرشيد</span>
          </div>`,
          { closeButton: false }
        )
        .openPopup();

      // Attribution minimal
       L.control.attribution({ prefix: '© OpenStreetMap' }).addTo(map);
      L.control.zoom({ position: 'bottomleft' }).addTo(map);
    });

    return () => {
      instanceRef.current?.remove();
      instanceRef.current = null;
    };
  }, []);

  return (
    <section id="location" className="py-24 relative min-h-[100dvh] flex items-center">
      <div className="container px-6 mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-mono px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase">
            <MapPin className="w-3.5 h-3.5" />
            موقعنا
          </div>
          <h2 className="text-4xl md:text-6xl font-black font-display mb-3">
            تعرف على <span className="text-primary">طريقك</span>
          </h2>
          <p className="text-white text-base">سوريا · دير الزور · شارع سينما فؤاد · جانب مركز الرشيد</p>
        </motion.div>

        {/* Map card */}
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 70, damping: 22, delay: 0.1 }}
          animate={{
            boxShadow: [
              '0 0 0px rgba(245,200,0,0), 0 0 0px rgba(245,200,0,0)',
              '0 0 30px rgba(245,200,0,0.35), 0 0 60px rgba(245,200,0,0.15)',
              '0 0 0px rgba(245,200,0,0), 0 0 0px rgba(245,200,0,0)',
            ],
          }}
          style={{ border: '2px solid rgba(245,200,0,0.5)' }}
        >
          {/* Map */}
          <div ref={mapRef} style={{ height: '420px', width: '100%' }} />

          {/* Bottom info bar */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4"
            style={{ background: 'rgba(10,10,10,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-start gap-3">
              <div className="bg-primary/15 p-2 rounded-xl shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-white text-sm font-medium leading-snug">
                  شارع سينما فؤاد، جانب مركز الرشيد
                </p>
                <p className="text-white text-xs mt-0.5">دير الزور · سوريا</p>
              </div>
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-primary text-black px-5 py-2.5 rounded-xl font-bold text-sm shrink-0 hover:bg-yellow-300 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              افتح في خرائط جوجل
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
