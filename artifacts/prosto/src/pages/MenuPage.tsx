import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { menuCategories, menuItems, type MenuItem } from "@/data/menu";
import {
  formatSYP,
  getCartCount,
  getCartTotal,
  readCart,
  type CartQuantities,
} from "@/lib/order";

const PHONE_NUMBER = "0996006263";

function QuantityControl({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (nextQuantity: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 p-1">
      <button
        type="button"
        aria-label="زيادة الكمية"
        onClick={() => onChange(quantity + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-black transition-transform hover:scale-105"
      >
        <Plus className="h-4 w-4" />
      </button>
      <span className="min-w-6 text-center text-sm font-black text-foreground">{quantity}</span>
      <button
        type="button"
        aria-label="إنقاص الكمية"
        onClick={() => onChange(Math.max(0, quantity - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
}

function MenuCard({
  item,
  quantity,
  onQuantityChange,
}: {
  item: MenuItem;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-3xl border border-foreground/10 bg-white/[0.035] shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
    >
      <div className="relative aspect-[1.35/1] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
        <div className="absolute bottom-4 right-4">
          <span className="rounded-full border border-primary/30 bg-black/50 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
            {item.nameEn}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-xl font-black text-foreground">{item.name}</h3>
          <p className="shrink-0 text-base font-black text-primary">{formatSYP(item.price)}</p>
        </div>
        <p className="mb-5 min-h-12 text-sm leading-6 text-foreground">{item.description}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-foreground">اختر الكمية</span>
          <QuantityControl quantity={quantity} onChange={onQuantityChange} />
        </div>
      </div>
    </motion.article>
  );
}

export default function MenuPage() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartQuantities>(() => readCart());
  const cartCount = useMemo(() => getCartCount(cart), [cart]);
  const cartTotal = useMemo(() => getCartTotal(cart), [cart]);

  useEffect(() => {
    window.localStorage.setItem("prosto-cart-v1", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart((current) => {
      const next = { ...current };
      if (quantity > 0) next[itemId] = quantity;
      else delete next[itemId];
      return next;
    });
  };

  return (
    <main dir="rtl" className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/85 backdrop-blur-2xl">
        <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-4">
          <a href="/" className="inline-flex items-center gap-3 text-sm font-bold text-foreground transition-colors hover:text-primary">
            <ArrowRight className="h-4 w-4" />
            العودة للموقع
          </a>
          <a href="/" className="font-display text-2xl font-black text-primary">PROSTO</a>
          <a href={`tel:${PHONE_NUMBER}`} className="hidden text-sm text-foreground transition-colors hover:text-primary sm:block">
            {PHONE_NUMBER}
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden pb-12 pt-20 md:pb-16 md:pt-28">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-bold tracking-widest text-primary">
            <Utensils className="h-4 w-4" />
            قائمة بروستو
          </span>
          <h1 className="mb-5 font-display text-5xl font-black md:text-7xl">
            اختار <span className="text-primary">طلبك</span>
          </h1>
          <p className="mx-auto max-w-xl text-base leading-8 text-foreground md:text-lg">
            اطلب وجبتك المفضلة بسهولة، وحدد الكمية ثم انتقل إلى الفاتورة لإرسال طلبك مباشرة عبر واتساب.
          </p>

          <nav className="mt-10 flex flex-wrap justify-center gap-3" aria-label="أقسام المنيو">
            {menuCategories.map((category) => (
              <a
                key={category}
                href={`#${category}`}
                className="rounded-full border border-foreground/15 px-5 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {category}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container mx-auto space-y-20 px-6 pb-44">
        {menuCategories.map((category) => {
          const items = menuItems.filter((item) => item.category === category);
          return (
            <section key={category} id={category} className="scroll-mt-28">
              <div className="mb-7 flex items-end justify-between gap-4 border-b border-foreground/10 pb-4">
                <div>
                  <p className="mb-2 text-xs font-bold tracking-widest text-primary">PROSTO MENU</p>
                  <h2 className="font-display text-3xl font-black md:text-4xl">{category}</h2>
                </div>
                <span className="text-sm text-foreground">{items.length} أصناف</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    quantity={cart[item.id] ?? 0}
                    onQuantityChange={(quantity) => updateQuantity(item.id, quantity)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-[#131108]/95 p-3 shadow-[0_0_45px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-black">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-foreground">اختيارك الحالي</p>
              <p className="font-black text-foreground">
                {cartCount} {cartCount === 1 ? "وجبة" : "وجبات"} · <span className="text-primary">{formatSYP(cartTotal)}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={cartCount === 0}
            onClick={() => setLocation("/checkout")}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(245,200,0,0.35)] disabled:cursor-not-allowed disabled:opacity-40 sm:px-7"
          >
            اطلب الآن
          </button>
        </div>
      </div>
    </main>
  );
}