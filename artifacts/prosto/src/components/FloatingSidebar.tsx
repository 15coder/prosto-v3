import { motion } from 'framer-motion';
import { Code2, Phone, Instagram, Facebook } from 'lucide-react';

const PHONE_NUMBER = "0996006263";
const DEVELOPER_URL = "https://Needaa.netlify.app";

const items = [
  { href: `tel:${PHONE_NUMBER}`, icon: <Phone size={16} />, label: "اتصل بنا" },
  { href: "https://instagram.com/prosto_restaurant.2026", icon: <Instagram size={16} />, label: "إنستغرام" },
  { href: "https://www.facebook.com/share/1CiMzSXhdU/", icon: <Facebook size={16} />, label: "فيسبوك" },
];

export default function FloatingSidebar() {
  return (
    <div className="fixed bottom-4 left-4 top-auto z-[60] flex flex-row gap-2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:flex-col md:gap-3">
      {items.map((item, i) => (
        <motion.a
          key={i}
          href={item.href}
          aria-label={item.label}
          target={item.href.startsWith('tel:') ? '_self' : '_blank'}
          rel="noopener noreferrer"
          className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-black/80 text-primary shadow-lg transition-all duration-300"
          style={{ background: 'rgba(10,10,10,0.65)', boxShadow: '0 0 12px rgba(245,200,0,0.1)' }}
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 + i * 0.15, type: 'spring', stiffness: 220, damping: 25 }}
          whileHover={{ scale: 1.2, boxShadow: '0 0 24px rgba(245,200,0,0.5)', backgroundColor: 'hsl(46,98%,48%)' }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.span
            className="text-primary group-hover:text-black transition-colors duration-200"
          >
            {item.icon}
          </motion.span>

          {/* Tooltip */}
          <span className="absolute bottom-12 left-0 bg-black/90 border border-primary/20 text-primary text-xs px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg md:bottom-auto md:left-12">
            {item.label}
          </span>
        </motion.a>
      ))}

      <motion.a
        href={DEVELOPER_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="من برمجة نداء الرحمن"
        className="group relative flex items-center gap-2 rounded-2xl border border-primary/25 bg-black/80 px-3 py-2 text-center shadow-lg transition-all duration-300 md:mt-2 md:w-[112px] md:flex-col md:gap-1.5 md:px-2 md:py-3"
        style={{ background: 'rgba(10,10,10,0.78)', boxShadow: '0 0 16px rgba(245,200,0,0.12)' }}
        whileHover={{ scale: 1.05, borderColor: 'rgba(245,200,0,0.65)', boxShadow: '0 0 24px rgba(245,200,0,0.32)' }}
        whileTap={{ scale: 0.96 }}
      >
        <motion.span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary"
          whileHover={{ rotate: 12, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15 }}
        >
          <Code2 size={14} />
        </motion.span>
        <span className="whitespace-nowrap text-[10px] leading-4 text-foreground">
          <span className="block">من برمجة</span>
          <strong className="block text-primary">نداء الرحمن</strong>
        </span>
        <span className="pointer-events-none absolute bottom-12 left-0 rounded-lg border border-primary/20 bg-black/95 px-2.5 py-1 text-xs text-primary opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 md:bottom-auto md:left-12 md:top-1/2 md:-translate-y-1/2">
          موقع المبرمج
        </span>
      </motion.a>

      {/* Vertical line connector */}
      <motion.div
        className="pointer-events-none absolute left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 md:block"
        style={{ top: '-24px', bottom: '-24px' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 2, duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}
