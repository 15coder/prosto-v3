import React, { useEffect, useRef, useState } from 'react';
import {
  motion, useScroll, AnimatePresence,
  useInView, LayoutGroup,
} from 'framer-motion';
import {
  MapPin, Phone, Instagram, Facebook, Menu, X,
  ExternalLink, Code2, ArrowDown, Utensils,
} from 'lucide-react';
import MapSection from '@/components/MapSection';
import ReadingProgress from '@/components/ReadingProgress';
import TypewriterText from '@/components/TypewriterText';
import WavyDivider from '@/components/WavyDivider';
import FloatingSidebar from '@/components/FloatingSidebar';
import { HeartIcon } from '@/components/AnimatedIcons';

// ─── Images ─────────────────────────────────────────────────────────────────
import logoImg  from "@assets/prosto_restaurant.2026_20260802_103738_853_1785659367070.jpg";
import img1     from "@assets/prosto_restaurant.2026_20260802_111407_667_1785659366905.jpg";
import img2     from "@assets/mazen_al.nezaa__official_20260802_111404_406_1785659366913.jpg";
import img3     from "@assets/mazen_al.nezaa__official_20260802_111404_196_1785659366919.jpg";
import img4     from "@assets/mazen_al.nezaa__official_20260802_111346_510_1785659366927.jpg";
import img5     from "@assets/prosto_restaurant.2026_20260802_111339_336_1785659366934.jpg";
import img6     from "@assets/prosto_restaurant.2026_20260802_111339_035_1785659366941.jpg";
import img7     from "@assets/prosto_restaurant.2026_20260802_111334_297_1785659366951.jpg";
import img8     from "@assets/prosto_restaurant.2026_20260802_111327_237_1785659366960.jpg";
import img9     from "@assets/prosto_restaurant.2026_20260802_111326_721_1785659366968.jpg";
import img10    from "@assets/prosto_restaurant.2026_20260802_111325_014_1785659366981.jpg";
import img11    from "@assets/prosto_restaurant.2026_20260802_111323_925_1785659366987.jpg";
import img12    from "@assets/prosto_restaurant.2026_20260802_111323_212_1785659366994.jpg";
import img14    from "@assets/prosto_restaurant.2026_20260802_111320_214_1785659367045.jpg";
import img18    from "@assets/prosto_restaurant.2026_20260802_111413_509_1785659366896.jpg";
import burgerImg1 from "@assets/برغر١_1785779651107.jpg";
import burgerImg2 from "@assets/برغر٢_1785779651119.jpg";
import burgerImg3 from "@assets/برغر٣_1785779651068.jpg";
import pizzaImg1  from "@assets/بيتزا١_1785779841029.jpg";
import pizzaImg2  from "@assets/بيتزا٢_1785779841015.jpg";
import pizzaImg3  from "@assets/بيتزا٣_1785779841002.jpg";
import pizzaImg4  from "@assets/بيتزا٤_1785779840989.jpg";
import pizzaImg5  from "@assets/بيتزا٥_1785779841023.jpg";

// ─── Constants ───────────────────────────────────────────────────────────────
const PHONE_NUMBER = "0996006263";

const navLinks = [
  { name: "الرئيسية", href: "#hero" },
  { name: "قصتنا",    href: "#about" },
  { name: "المنيو",   href: "/menu" },
  { name: "المعرض",   href: "#gallery" },
  { name: "موقعنا",   href: "#location" },
];

type GalleryFilter = 'burger' | 'chicken' | 'pizza';

const galleryItems: { src: string; label: string; category: GalleryFilter }[] = [
  { src: img5,  label: "أجواء مميزة",  category: "chicken" },
  { src: img4,  label: "دجاج مقرمش",   category: "chicken" },
  { src: img6,  label: "طعم لا يُنسى", category: "pizza"   },
  { src: img7,      label: "بيتزا بروستو",   category: "pizza"   },
  { src: pizzaImg1, label: "بيتزا دجاج",     category: "pizza"   },
  { src: pizzaImg2, label: "بيتزا خضار",     category: "pizza"   },
  { src: pizzaImg3, label: "بيتزا مشكلة",    category: "pizza"   },
  { src: pizzaImg4, label: "تشكيلة البيتزا", category: "pizza"   },
  { src: pizzaImg5, label: "بيتزا جبنة",     category: "pizza"   },
  { src: img9,  label: "جودة عالية",   category: "burger"  },
  { src: img18, label: "شهية مفتوحة",  category: "chicken" },
  { src: burgerImg1, label: "برغر بروستو",   category: "burger"  },
  { src: burgerImg2, label: "برغر كلاسيك",  category: "burger"  },
  { src: burgerImg3, label: "تشيز برغر",    category: "burger"  },
  { src: img11, label: "وصفات سرية",   category: "chicken" },
  { src: img14, label: "مكونات طازجة", category: "burger"  },
  { src: img10, label: "كوردون بلو",   category: "chicken" },
  { src: img2,  label: "تشكيلة رائعة", category: "chicken" },
  { src: img1,  label: "طبق خاص",      category: "burger"  },
  { src: img12, label: "شاورما حارة",  category: "chicken" },
];

const filterLabels: Record<GalleryFilter, string> = {
  burger:  "برغر 🍔",
  chicken: "دجاج 🍗",
  pizza:   "بيتزا 🍕",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function AnimatedSection({ children, className = "", delay = 0, style }: {
  children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/** Lightweight section background image. It stays static during scroll to avoid
 * several independent scroll-linked animations competing for the main thread. */
function SectionBackground({ src, opacity = 0.35 }: {
  src: string; opacity?: number;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover scale-110" style={{ opacity }} />
    </div>
  );
}

// ─── Coder Credit (per-character cinematic entrance) ─────────────────────────
function CoderCredit() {
  const ref = useRef<HTMLAnchorElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  // Each word of the name animates in independently
  const words = ["نداء", "الرحمن"];
  // Direction alternates: first word flies from right, second from left (RTL)
  const wordOrigins = [
    { x: 60,  y: -20, rotate: 12  },
    { x: -60, y: 20,  rotate: -12 },
  ];

  return (
    <motion.a
      ref={ref}
      href="https://Needaa.netlify.app"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(245,200,0,0.4)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
      whileHover={{ scale: 1.04 }}
    >
      {/* Logo — spins in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.2, rotate: -200 }}
        animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.05 }}
        className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-primary/50 shrink-0"
      >
        <img src="/coder-logo.jpg" alt="15coder" className="w-full h-full object-cover" />
      </motion.div>

      {/* Icon — pops in */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.18 }}
      >
        <Code2 className="w-4 h-4 text-primary shrink-0" />
      </motion.div>

      {/* Label — slides up */}
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.25 }}
        className="text-foreground text-xs"
      >
         من برمجة
      </motion.span>

      <motion.span
        className="w-px h-4 bg-foreground/10"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.35 }}
      />

      {/* Name — each word bursts in from a different direction */}
      <span className="flex items-baseline gap-1.5 overflow-visible" dir="rtl">
        {words.map((word, i) => (
          <motion.span
            key={word}
            initial={{
              opacity: 0,
              x: wordOrigins[i].x,
              y: wordOrigins[i].y,
              rotate: wordOrigins[i].rotate,
              scale: 0.5,
            }}
            animate={isInView ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 } : {}}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 18,
              delay: 0.42 + i * 0.12,
            }}
            className="text-base font-black text-foreground group-hover:text-primary transition-colors duration-200 inline-block"
            style={{ textShadow: "0 0 20px rgba(245,200,0,0)" }}
            whileHover={{ textShadow: "0 0 20px rgba(245,200,0,0.6)" }}
          >
            {word}
          </motion.span>
        ))}
      </span>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.7 }}
      >
        <ExternalLink className="w-3 h-3 text-foreground group-hover:text-primary transition-colors shrink-0" />
      </motion.div>
    </motion.a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>('chicken');
  const lastScrollYRef = useRef(0);
  const isScrolledRef = useRef(false);
  const navVisibleRef = useRef(true);

  const { scrollY } = useScroll();

  // Scroll listener
  useEffect(() => {
    const unsub = scrollY.on("change", (latest) => {
      const nextIsScrolled = latest > 50;
      const nextNavVisible = latest < lastScrollYRef.current || latest < 100;

      if (nextIsScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }
      if (nextNavVisible !== navVisibleRef.current) {
        navVisibleRef.current = nextNavVisible;
        setNavVisible(nextNavVisible);
      }
      lastScrollYRef.current = latest;
    });
    return unsub;
  }, [scrollY]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const filtered = galleryItems.filter(g => g.category === galleryFilter);

  return (
    <div className="bg-background text-foreground min-h-[100dvh] overflow-x-hidden selection:bg-primary selection:text-black font-sans">

      {/* ─── Global overlays ─── */}
      <ReadingProgress />
      <FloatingSidebar />

      {/* ─── NAVBAR ─── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/95 border-b border-border/40 shadow-xl py-3"
            : "bg-transparent py-5"
        }`}
        initial={{ y: -80 }}
        animate={{ y: navVisible ? 0 : -80 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <motion.div
              className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/40 group-hover:ring-primary transition-all shadow-[0_0_15px_rgba(245,200,0,0.25)]"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <img src={logoImg} alt="Prosto" className="w-full h-full object-cover" />
            </motion.div>
            <span className="text-xl font-black tracking-tight text-primary hidden sm:block">PROSTO</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7 font-medium">
            {navLinks.map((link, i) => (
              <motion.a key={link.name} href={link.href}
                className="text-foreground hover:text-primary transition-colors text-base relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-center rounded-full" />
              </motion.a>
            ))}

            <motion.a href={`tel:${PHONE_NUMBER}`}
              className="bg-primary text-black px-6 py-2.5 rounded-full font-bold shadow-[0_0_20px_rgba(245,200,0,0.35)] hover:shadow-[0_0_40px_rgba(245,200,0,0.6)] transition-all text-sm"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              اطلب الآن
            </motion.a>
          </div>

          <button className="md:hidden text-foreground p-1" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-background flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/40">
                <img src={logoImg} alt="Prosto" className="w-full h-full object-cover" />
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-foreground p-2">
                <X size={32} />
              </button>
            </div>
            <motion.div className="flex flex-col gap-8 items-start text-3xl font-bold"
              initial="hidden" animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              {navLinks.map(link => (
                <motion.a key={link.name} href={link.href}
                  variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-primary transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="mt-2 w-full h-[1px] bg-border/50" />
              <motion.a href={`tel:${PHONE_NUMBER}`}
                variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0 } }}
                className="text-primary flex items-center gap-4 mt-2"
              >
                <Phone />
                {PHONE_NUMBER}
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HERO ─── */}
      <section id="hero" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <div className="absolute inset-0 z-0">
          {/* Day/Night overlays */}
          <motion.div
            className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/55 to-background/20"
            animate={{ opacity: 1 }} transition={{ duration: 0.7 }}
          />
          <motion.div className="absolute inset-0 z-10 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
          <img
            src={img1} alt="Prosto Food"
            className="w-full h-full object-cover"
            style={{ opacity: 0.42 }}
          />
        </div>

        {/* Golden particles */}
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full bg-primary"
              style={{
                width: 3 + (i % 5),
                height: 3 + (i % 5),
                left: `${(i * 4.1) % 100}%`,
                boxShadow: "0 0 6px rgba(245,200,0,0.55)",
                opacity: 0.9,
                willChange: "transform, opacity",
              }}
              initial={{ y: "110vh", opacity: 0 }}
              animate={{ y: "-10vh", opacity: [0, 0.9, 0.9, 0] }}
              transition={{
                duration: 18 + (i % 8) * 1.5,
                repeat: Infinity,
                delay: (i * 1.1) % 14,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 px-6 pt-24">
          <motion.div
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
            variants={staggerContainer} initial="hidden" animate="show"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="px-5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(245,200,0,0.15)] backdrop-blur-md">
                التجربة الأقوى في دير الزور
              </span>
            </motion.div>

            {/* Animated logo */}
            <motion.div
              variants={{ hidden: { opacity: 0, scale: 0.5, rotate: -10 }, show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 120, damping: 18 } } }}
              className="mb-8"
              whileHover={{ scale: 1.05, rotate: 3 }}
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-primary/50 shadow-[0_0_60px_rgba(245,200,0,0.4)]">
                <img src={logoImg} alt="Prosto Logo" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="text-7xl md:text-9xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-primary via-yellow-400 to-amber-600 drop-shadow-[0_0_40px_rgba(245,200,0,0.4)] tracking-tighter leading-none font-display"
            >
              PROSTO
            </motion.h1>
            <motion.h2 variants={fadeUp}
              className="text-4xl md:text-6xl font-black text-foreground mb-6 drop-shadow-xl font-display"
            >
              بروستو
            </motion.h2>

            {/* Typewriter slogan */}
            <motion.p variants={fadeUp}
              className="text-xl md:text-3xl text-foreground font-medium mb-12 max-w-xl min-h-[2em]"
            >
              <TypewriterText text="لأن الجوع إلو بروستو!" delay={1.2} speed={80} />
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="#about"
                className="group inline-flex w-full sm:w-auto min-w-[190px] items-center justify-center gap-3 border border-foreground/25 text-foreground px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-colors hover:border-primary hover:text-primary hover:-translate-y-0.5 active:translate-y-0"
              >
                <ArrowDown className="w-5 h-5" />
                <span>تصفح الموقع</span>
              </motion.a>
              <motion.a
                href="/menu"
                className="inline-flex w-full sm:w-auto min-w-[190px] items-center justify-center gap-3 bg-primary text-black px-8 py-4 rounded-full font-black text-lg shadow-[0_0_25px_rgba(245,200,0,0.28)] hover:shadow-[0_0_40px_rgba(245,200,0,0.45)] transition-shadow hover:-translate-y-0.5 active:translate-y-0"
              >
                <Utensils className="w-5 h-5" />
                <span>عرض المنيو</span>
              </motion.a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-3" aria-label="حسابات بروستو على مواقع التواصل">
              {[
                { href: "https://instagram.com/prosto_restaurant.2026", label: "إنستغرام", icon: <Instagram className="h-5 w-5" /> },
                { href: "https://www.facebook.com/share/1CiMzSXhdU/", label: "فيسبوك", icon: <Facebook className="h-5 w-5" /> },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/35 bg-black/30 text-primary backdrop-blur-sm transition-colors hover:bg-primary hover:text-black"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-primary/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        </motion.div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 relative overflow-hidden min-h-[100dvh] flex items-center">
        {/* Parallax bg for this section */}
        <SectionBackground src={img9} opacity={0.05} />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/[0.015] to-transparent pointer-events-none" />

        {/* Giant Arabic watermark — behind all content */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="text-[20vw] font-black font-display leading-none text-foreground/[0.035] whitespace-nowrap"
            style={{ letterSpacing: '-0.02em' }}
          >
            بروستو
          </span>
        </div>

        <div className="container px-6 mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <AnimatedSection className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl" delay={0}>
              <img src={img5} alt="Prosto Restaurant" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              <motion.div className="absolute bottom-8 left-8 right-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <HeartIcon size={22} />
                  <p className="text-primary font-bold text-xl drop-shadow-md">أجواء مميزة</p>
                </div>
                <p className="text-foreground text-sm mt-1">مكان يجمع العائلة والأصدقاء</p>
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-3xl border border-primary/20 pointer-events-none"
                style={{ borderColor: "rgba(245,200,0,0.22)" }}
              />
            </AnimatedSection>

            <AnimatedSection
              className="p-8 md:p-12 rounded-3xl border border-primary/15 relative overflow-hidden"
              delay={0.15}
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <motion.div
                className="absolute top-0 right-0 w-40 h-40 blur-[70px] rounded-full pointer-events-none"
                style={{ background: "rgba(245,200,0,0.12)" }}
              />
              <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10 font-display">
                قصتنا تبدأ من <span className="text-primary">الجودة</span>
              </h2>
              <p className="text-foreground text-lg leading-relaxed mb-5 relative z-10">
                في بروستو، نؤمن بأن الوجبة السريعة لا يجب أن تكون عادية. نحن نختار مكوناتنا بعناية فائقة، من الدجاج الطازج إلى الخضروات اليومية.
              </p>
              <p className="text-foreground text-lg leading-relaxed mb-8 relative z-10">
                مزيجنا السري من البهارات وطريقة التحضير الفريدة تجعل من بروستو الوجهة الأولى لعشاق الطعام في المدينة.
              </p>
              <motion.div className="flex items-center gap-3 text-foreground font-medium relative z-10"
                whileHover={{ x: -4 }} transition={{ type: "spring", stiffness: 300 }}
              >
                <MapPin className="text-primary w-5 h-5 shrink-0" />
                <span>سوريا - دير الزور - شارع سينما فؤاد - جانب مركز الرشيد</span>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── GALLERY (with filter + reorder) ─── */}
      <section id="gallery" className="py-24 relative overflow-hidden min-h-[100dvh] flex items-center">
        <SectionBackground src={img14} opacity={0.05} />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 35% 50%, rgba(245,200,0,0.06) 0%, transparent 60%)" }}
        />

        <div className="container px-6 mx-auto relative z-10">
          {/* Header */}
          <AnimatedSection className="text-center mb-10">
            <span className="inline-block px-5 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary text-xs tracking-widest uppercase mb-5 backdrop-blur-sm">
              معرض الصور
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-3 font-display">
              لحظات من <span className="text-primary">بروستو</span>
            </h2>
            <p className="text-foreground text-lg">كل صورة تحكي نكهة</p>
          </AnimatedSection>

          {/* Filter buttons */}
          <AnimatedSection className="flex flex-wrap justify-center gap-3 mb-10" delay={0.1}>
            {(Object.keys(filterLabels) as GalleryFilter[]).map(key => (
              <motion.button key={key}
                onClick={() => setGalleryFilter(key)}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 border ${
                  galleryFilter === key
                    ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(245,200,0,0.4)]'
                    : 'bg-transparent text-foreground border-foreground/20 hover:border-primary/50 hover:text-primary'
                }`}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
              >
                {filterLabels[key]}
              </motion.button>
            ))}
          </AnimatedSection>

          {/* Filtered grid with layout animation */}
          <LayoutGroup>
            <motion.div layout="position" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              <AnimatePresence mode="sync" initial={false}>
                {filtered.map((item, i) => (
                  <motion.div key={item.src + item.label}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.02 }}
                    className="group relative rounded-2xl overflow-hidden aspect-square"
                    whileHover={{ scale: 1.04, zIndex: 20 }}
                  >
                    <img src={item.src} alt={item.label}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <motion.div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-400 mix-blend-overlay" />
                    <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary/40 transition-colors duration-300 pointer-events-none" />

                    {/* Label */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-[2px] bg-primary rounded-full" />
                        <span className="text-white text-xs font-bold drop-shadow-lg">{item.label}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </section>

      {/* ─── DELIVERY CTA ─── */}
      <section className="relative py-32 overflow-hidden border-y border-primary/15 min-h-[100dvh] flex items-center">
        <SectionBackground src={img18} opacity={0.08} />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(245,200,0,0.1) 0%, transparent 70%)" }}
        />

        <div className="container relative z-10 px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h2 className="text-5xl md:text-7xl font-black mb-4 text-foreground">
              توصيل سريع
            </motion.h2>
            <p className="text-xl md:text-2xl text-primary font-medium mb-10">لباب بيتك، ساخن ومقرمش كما تحب!</p>

            <div className="mx-auto max-w-md text-right">
              <a href="/menu"
                className="group flex min-h-[170px] flex-col items-center justify-center gap-4 border border-primary/35 bg-primary text-black p-8 rounded-3xl transition-transform duration-200 hover:-translate-y-1 active:translate-y-0"
              >
                <div className="bg-black/10 p-4 rounded-full">
                  <Utensils className="w-9 h-9" />
                </div>
                <div className="text-center">
                  <p className="text-black text-sm mb-1">جهّز طلبك</p>
                  <p className="text-2xl font-black">انتقل إلى المنيو</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── MAP ─── */}
      <MapSection />

      {/* ─── WAVY DIVIDER ─── */}
      <WavyDivider flip className="-mt-1" />

      {/* ─── FOOTER ─── */}
      <footer className="bg-background pt-16 pb-10">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

            {/* Brand */}
            <div className="flex flex-col items-center md:items-start text-center md:text-right">
              <motion.div
                className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/30 mb-4 shadow-[0_0_20px_rgba(245,200,0,0.2)]"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={logoImg} alt="Prosto Logo" className="w-full h-full object-cover" />
              </motion.div>
              <span className="text-2xl font-black text-primary mb-3 block">PROSTO | بروستو</span>
              <p className="text-foreground mb-6 max-w-xs text-sm leading-relaxed">
                لأن الجوع إلو بروستو! أفضل تجربة طعام سريع في دير الزور.
              </p>
              <div className="flex gap-3">
                {[
                  { href: "https://instagram.com/prosto_restaurant.2026", icon: <Instagram size={18} /> },
                  { href: "https://www.facebook.com/share/1CiMzSXhdU/", icon: <Facebook size={18} /> },
                ].map((s, i) => (
                  <motion.a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center text-foreground hover:bg-primary hover:text-black hover:border-primary transition-all duration-300"
                    whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-col items-center md:items-start text-center md:text-right">
              <h4 className="text-lg font-bold text-foreground mb-5">روابط سريعة</h4>
              <ul className="flex flex-col gap-3">
                {navLinks.map((link, i) => (
                  <motion.li key={link.name} initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                    <a href={link.href} className="text-foreground hover:text-primary transition-colors text-sm">{link.name}</a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center md:items-start text-center md:text-right">
              <h4 className="text-lg font-bold text-foreground mb-5">تواصل معنا</h4>
              <ul className="flex flex-col gap-4 text-foreground text-sm">
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <MapPin className="text-primary w-4 h-4 shrink-0 mt-0.5" />
                  <span>سوريا - دير الزور - شارع سينما فؤاد - جانب مركز الرشيد</span>
                </li>
                <li className="flex items-center gap-3 justify-center md:justify-start">
                  <Phone className="text-primary w-4 h-4 shrink-0" />
                  <a href={`tel:${PHONE_NUMBER}`} className="hover:text-primary transition-colors" dir="ltr">{PHONE_NUMBER}</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-foreground/8 pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-foreground text-[11px]">
              &copy; {new Date().getFullYear()} PROSTO Restaurant. All rights reserved.
            </p>
            <CoderCredit />
          </div>
        </div>
      </footer>

    </div>
  );
}
