import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Minus,
  Navigation,
  Plus,
  RotateCcw,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import {
  formatSYP,
  getCartLines,
  getCartTotal,
  getExactLocation,
  readCart,
  sendOrderToWhatsApp,
  type CartQuantities,
} from "@/lib/order";

const WHATSAPP_NUMBER = "963996006263";
const RESTAURANT_LOCATION = { lat: 35.3311, lng: 40.1407 };
const DELIVERY_RATE_PER_KM = 1000;
const COUPON_CODE = "Hello";
const COUPON_DISCOUNT_RATE = 0.1;

type LocationStatus = "idle" | "loading" | "success" | "error";
type TelegramStatus = "idle" | "sending" | "success" | "error";

function haversineDistanceInKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(to.lat - from.lat);
  const longitudeDelta = toRadians(to.lng - from.lng);
  const latitudeA = toRadians(from.lat);
  const latitudeB = toRadians(to.lat);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.sin(longitudeDelta / 2) ** 2 * Math.cos(latitudeA) * Math.cos(latitudeB);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const formatDistance = (distance: number) =>
  `${new Intl.NumberFormat("en-US", {
    numberingSystem: "latn",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(distance)} كم`;

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartQuantities>(() => readCart());
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [mapsUrl, setMapsUrl] = useState("");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationError, setLocationError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [telegramStatus, setTelegramStatus] = useState<TelegramStatus>("idle");
  const [telegramMessage, setTelegramMessage] = useState("");
  const [manualLocationInput, setManualLocationInput] = useState("");
  const [manualLocationMessage, setManualLocationMessage] = useState("");
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [clearCartConfirmOpen, setClearCartConfirmOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("prosto-cart-v1", JSON.stringify(cart));
  }, [cart]);

  const lines = useMemo(() => getCartLines(cart), [cart]);
  const subtotal = useMemo(() => getCartTotal(cart), [cart]);
  const distance = coordinates ? haversineDistanceInKm(RESTAURANT_LOCATION, coordinates) : null;
  const billableKilometers = distance === null ? null : Math.max(1, Math.ceil(distance));
  const deliveryFee = billableKilometers === null ? null : billableKilometers * DELIVERY_RATE_PER_KM;
  const discount = couponApplied ? Math.round(subtotal * COUPON_DISCOUNT_RATE) : 0;
  const total = subtotal - discount + (deliveryFee ?? 0);

  const applyCoupon = () => {
    if (couponCode.trim().toLowerCase() === COUPON_CODE.toLowerCase()) {
      setCouponApplied(true);
      setCouponMessage("تم تطبيق كود الخصم — خصم 10٪");
      return;
    }

    setCouponApplied(false);
    setCouponMessage("كود الخصم غير صحيح");
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart((current) => {
      const next = { ...current };
      if (quantity > 0) next[itemId] = quantity;
      else delete next[itemId];
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
    window.localStorage.removeItem("prosto-cart-v1");
    setClearCartConfirmOpen(false);
    setCouponCode("");
    setCouponApplied(false);
    setCouponMessage("");
  };

  const requestLocation = async () => {
    setLocationStatus("loading");
    setLocationError("");
    try {
      const location = await getExactLocation();
      setCoordinates({ lat: location.lat, lng: location.lng });
      setMapsUrl(location.mapsUrl);
      setLocationStatus("success");
      setShowManualLocation(false);
      setManualLocationMessage("");
    } catch {
      setLocationStatus("error");
      setLocationError("لم نتمكن من الوصول إلى موقعك. يمكنك إدخاله يدوياً بدلاً من ذلك.");
      setShowManualLocation(true);
    }
  };

  const applyManualLocation = () => {
    const parts = manualLocationInput
      .replace("،", ",")
      .split(/[,\s]+/)
      .map((part) => Number(part.trim()))
      .filter((part) => Number.isFinite(part));

    const [latitude, longitude] = parts;
    if (
      parts.length !== 2 ||
      latitude === undefined ||
      longitude === undefined ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setManualLocationMessage("أدخل الإحداثيات بهذا الشكل: 35.3311, 40.1407");
      return;
    }

    setCoordinates({ lat: latitude, lng: longitude });
    setMapsUrl(`https://maps.google.com/?q=${latitude},${longitude}`);
    setLocationStatus("success");
    setLocationError("");
    setManualLocationMessage("تم حفظ موقعك اليدوي وحساب التوصيل.");
    setShowManualLocation(false);
  };

  const openOrderSummary = () => {
    if (!coordinates || distance === null || deliveryFee === null) return;
    setSummaryOpen(true);
  };

  const sendToWhatsApp = async () => {
    if (!coordinates || distance === null || deliveryFee === null) return;

    setSummaryOpen(false);
    setTelegramStatus("sending");
    setTelegramMessage("جارٍ تجهيز طلبك...");

    try {
      const response = await fetch("/.netlify/functions/telegram", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: lines.map((line) => ({
            name: line.name,
            quantity: line.quantity,
            lineTotal: line.lineTotal,
          })),
          subtotal,
          discount,
          deliveryFee,
          total,
          distanceKm: distance,
          billableKilometers,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        }),
      });
      const responseText = await response.text();
      let result: {
        ok?: boolean;
        verificationCode?: string;
        message?: string;
      };
      try {
        result = JSON.parse(responseText) as typeof result;
      } catch {
        throw new Error(
          response.ok
            ? "تعذر قراءة رد الخادم."
            : "تعذر الوصول إلى خادم الطلب. حاول مجددًا بعد لحظات.",
        );
      }

      if (!response.ok || !result.ok || !result.verificationCode) {
        throw new Error(result.message ?? "تعذر إرسال نسخة التحقق.");
      }

      const message = [
        "مرحباً مطعم بروستو، أريد تأكيد طلبي:",
        "",
        `رمز المطابقة الرسمي: ${result.verificationCode}`,
        "",
      "",
        ...lines.map((line) => `• ${line.name} × ${line.quantity} = ${formatSYP(line.lineTotal)}`),
      "",
      `المجموع الفرعي: ${formatSYP(subtotal)}`,
      `قيمة الخصم: -${formatSYP(discount)}`,
      `المسافة التقريبية من المطعم: ${formatDistance(distance)}`,
      `الكيلومترات المحسوبة للتوصيل: ${billableKilometers} كم`,
      `أجرة التوصيل: ${formatSYP(deliveryFee)}`,
      `المجموع الكلي: ${formatSYP(total)}`,
      "",
      "يرجى تأكيد الطلب والوقت المتوقع للتوصيل. شكراً.",
    ].join("\n");

      sendOrderToWhatsApp(
        WHATSAPP_NUMBER,
        message,
        mapsUrl || `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`,
      );
      setTelegramStatus("success");
      setTelegramMessage("تم تجهيز رسالتك، وسيتم فتح واتساب الآن.");
    } catch (error) {
      setTelegramStatus("error");
      setTelegramMessage(
        navigator.onLine
          ? "تعذر إرسال الطلب حالياً. حاول مرة أخرى."
          : "لا يوجد اتصال بالإنترنت. تحقق من الاتصال ثم أعد المحاولة.",
      );
    }
  };

  if (lines.length === 0) {
    return (
      <main dir="rtl" className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="w-full max-w-lg rounded-3xl border border-foreground/10 bg-white/[0.035] p-8 text-center shadow-2xl">
          <ShoppingBag className="mx-auto mb-5 h-12 w-12 text-primary" />
          <h1 className="mb-3 font-display text-3xl font-black">السلة فارغة</h1>
          <p className="mb-7 leading-7 text-foreground">أضف وجبتك المفضلة من المنيو أولاً، ثم عد إلى صفحة الفاتورة.</p>
          <button
            type="button"
            onClick={() => setLocation("/menu")}
            className="rounded-xl bg-primary px-7 py-3 font-black text-black transition-transform hover:scale-[1.02]"
          >
            تصفح المنيو
          </button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="border-b border-foreground/10 bg-background/85 backdrop-blur-2xl">
        <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-4">
          <button
            type="button"
            onClick={() => setLocation("/menu")}
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-primary"
          >
            <ArrowRight className="h-4 w-4" />
            تعديل الطلب
          </button>
          <a href="/" className="font-display text-2xl font-black text-primary">PROSTO</a>
          <span className="hidden text-sm text-foreground sm:block">الفاتورة النهائية</span>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-6 pb-20 pt-12 md:pt-20">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold tracking-widest text-primary">PROSTO CHECKOUT</p>
          <h1 className="font-display text-4xl font-black md:text-6xl">
            تفاصيل <span className="text-primary">طلبك</span>
          </h1>
          <p className="mt-4 max-w-2xl leading-8 text-foreground">
            راجع اختيارك، ثم حدد موقعك ليتم حساب التوصيل بدقة وإرسال الفاتورة كاملة إلى واتساب.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-foreground/10 bg-white/[0.035] p-5 shadow-2xl md:p-7">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-foreground/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black">الأصناف المختارة</h2>
                    <p className="text-xs text-foreground">{lines.length} أصناف مختلفة</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setClearCartConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-300/70 transition-colors hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                إفراغ السلة
              </button>
            </div>

            <div className="space-y-4">
              {lines.map((line) => (
                <div key={line.id} className="flex items-center gap-3 rounded-2xl border border-foreground/8 bg-black/10 p-3 sm:gap-4">
                  <img src={line.image} alt={line.name} className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-black">{line.name}</h3>
                    <p className="mt-1 text-xs text-foreground">{formatSYP(line.price)} للقطعة</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <p className="font-black text-primary">{formatSYP(line.lineTotal)}</p>
                    <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 p-1">
                      <button
                        type="button"
                        aria-label={`زيادة ${line.name}`}
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-black"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-5 text-center text-sm font-black">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label={`إنقاص ${line.name}`}
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/15 text-foreground"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-primary/20 bg-primary/[0.06] p-5 shadow-2xl md:p-7">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-black">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black">حدد موقع التوصيل</h2>
                  <p className="mt-1 text-sm leading-6 text-foreground">سنحسب المسافة من المطعم ونضيف 1,000 ليرة عن كل كيلومتر.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={requestLocation}
                disabled={locationStatus === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-black text-black transition-all hover:shadow-[0_0_25px_rgba(245,200,0,0.35)] disabled:cursor-wait disabled:opacity-60"
              >
                {locationStatus === "loading" ? (
                  "جارٍ تحديد موقعك..."
                ) : locationStatus === "success" ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    تم تحديد موقعي
                  </>
                ) : (
                  <>
                    <Navigation className="h-5 w-5" />
                    تحديد موقعي الآن
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowManualLocation((current) => !current);
                  setManualLocationMessage("");
                }}
                className="mt-3 w-full rounded-xl border border-foreground/15 px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {showManualLocation ? "إغلاق الإدخال اليدوي" : "إدخال الموقع يدوياً"}
              </button>

              {showManualLocation && (
                <form
                  className="mt-4 rounded-2xl border border-foreground/10 bg-black/15 p-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    applyManualLocation();
                  }}
                >
                  <label htmlFor="manual-location" className="text-sm font-bold">
                    إحداثيات موقعك
                  </label>
                  <p className="mt-1 text-xs leading-5 text-foreground">
                    انسخ الإحداثيات من خرائط Google بهذا الشكل: خط العرض، خط الطول
                  </p>
                  <input
                    id="manual-location"
                    value={manualLocationInput}
                    onChange={(event) => setManualLocationInput(event.target.value)}
                    placeholder="35.3311, 40.1407"
                    inputMode="decimal"
                    dir="ltr"
                    className="mt-3 w-full rounded-xl border border-foreground/15 bg-black/20 px-3 py-3 text-center text-sm font-bold text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-primary"
                  />
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-bold text-primary hover:underline"
                  >
                    افتح خرائط Google لنسخ الإحداثيات
                  </a>
                  <button
                    type="submit"
                    className="mt-3 w-full rounded-xl bg-primary px-4 py-3 text-sm font-black text-black transition-transform hover:-translate-y-0.5"
                  >
                    حفظ الموقع وحساب التوصيل
                  </button>
                  {manualLocationMessage && (
                    <p className={`mt-3 text-xs font-bold ${locationStatus === "success" ? "text-emerald-300" : "text-red-300"}`}>
                      {manualLocationMessage}
                    </p>
                  )}
                </form>
              )}

              {locationStatus === "success" && distance !== null && deliveryFee !== null && (
                <div className="mt-4 rounded-2xl border border-primary/20 bg-black/15 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-foreground">المسافة المحسوبة</span>
                    <strong className="text-primary">{formatDistance(distance)}</strong>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                    <span className="text-foreground">المسافة المحاسبية</span>
                    <strong>{billableKilometers} كم × {formatSYP(DELIVERY_RATE_PER_KM)}</strong>
                  </div>
                </div>
              )}

              {locationStatus === "error" && (
                <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-red-300">
                  <AlertCircle className="mt-1 h-4 w-4 shrink-0" />
                  {locationError}
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-foreground/10 bg-white/[0.035] p-5 shadow-2xl md:p-7">
              <h2 className="mb-5 font-black">ملخص الفاتورة</h2>
              <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/[0.06] p-4">
                <label htmlFor="coupon-code" className="mb-3 flex items-center gap-2 text-sm font-bold">
                  <Tag className="h-4 w-4 text-primary" />
                  كود الخصم
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon-code"
                    value={couponCode}
                    onChange={(event) => {
                      setCouponCode(event.target.value);
                      setCouponApplied(false);
                      setCouponMessage("");
                    }}
                    placeholder="أدخل الكود"
                    dir="ltr"
                    className="min-w-0 flex-1 rounded-xl border border-foreground/15 bg-black/20 px-3 py-2.5 text-center text-sm font-bold text-foreground outline-none transition-colors placeholder:text-foreground focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    تطبيق
                  </button>
                </div>
                {couponMessage && (
                  <p className={`mt-2 text-xs font-bold ${couponApplied ? "text-green-300" : "text-red-300"}`}>
                    {couponMessage}
                  </p>
                )}
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3 text-foreground">
                  <span>مجموع الوجبات</span>
                  <strong className="text-foreground">{formatSYP(subtotal)}</strong>
                </div>
                <div className="flex items-center justify-between gap-3 text-foreground">
                  <span>سعر التوصيل</span>
                  <strong className="text-foreground">{deliveryFee === null ? "حدد موقعك" : formatSYP(deliveryFee)}</strong>
                </div>
                {couponApplied && (
                  <div className="flex items-center justify-between gap-3 text-green-300">
                    <span>الخصم</span>
                    <strong>-{formatSYP(discount)}</strong>
                  </div>
                )}
                <div className="my-4 border-t border-foreground/10" />
                <div className="flex items-end justify-between gap-3">
                  <span className="font-bold text-foreground">المجموع الكلي</span>
                  <strong className="text-2xl font-black text-primary">{formatSYP(total)}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={openOrderSummary}
                disabled={!coordinates || locationStatus !== "success" || telegramStatus === "sending"}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-4 font-black text-[#071b0d] transition-all hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(37,211,102,0.3)] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <MessageCircle className="h-5 w-5" />
                {telegramStatus === "sending" ? "جارٍ تجهيز الطلب..." : "اطلب الآن عبر واتساب"}
              </button>
              {telegramMessage && (
                <div className="mt-3 text-center">
                  <p className={`text-[11px] font-bold leading-5 ${telegramStatus === "error" ? "text-red-300" : "text-foreground"}`}>
                    {telegramMessage}
                  </p>
                  {telegramStatus === "error" && (
                    <button
                      type="button"
                      onClick={() => void sendToWhatsApp()}
                      disabled={!coordinates}
                      className="mt-2 inline-flex items-center gap-2 rounded-full border border-primary/35 px-4 py-2 text-xs font-black text-primary transition-colors hover:bg-primary hover:text-black disabled:opacity-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      إعادة المحاولة
                    </button>
                  )}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>

      {clearCartConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="clear-cart-title">
          <div className="w-full max-w-sm rounded-3xl border border-red-300/20 bg-[#15120a] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="clear-cart-title" className="text-lg font-black">إفراغ السلة؟</h2>
                <p className="mt-2 text-sm leading-6 text-foreground">سيتم حذف كل الأصناف المختارة ولا يمكن التراجع عن ذلك.</p>
              </div>
              <button type="button" onClick={() => setClearCartConfirmOpen(false)} className="rounded-full p-2 text-foreground transition-colors hover:bg-white/10 hover:text-primary" aria-label="إغلاق">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setClearCartConfirmOpen(false)} className="flex-1 rounded-xl border border-foreground/15 px-4 py-3 text-sm font-bold transition-colors hover:border-primary hover:text-primary">
                إلغاء
              </button>
              <button type="button" onClick={clearCart} className="flex-1 rounded-xl bg-red-300 px-4 py-3 text-sm font-black text-black transition-transform hover:-translate-y-0.5">
                إفراغ السلة
              </button>
            </div>
          </div>
        </div>
      )}

      {summaryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-labelledby="order-summary-title">
          <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-primary/25 bg-[#15120a] p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-widest text-primary">مراجعة أخيرة</p>
                <h2 id="order-summary-title" className="mt-2 text-2xl font-black">ملخص طلبك</h2>
              </div>
              <button type="button" onClick={() => setSummaryOpen(false)} className="rounded-full p-2 text-foreground transition-colors hover:bg-white/10 hover:text-primary" aria-label="إغلاق">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {lines.map((line) => (
                <div key={line.id} className="flex items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-white/[0.035] p-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{line.name}</p>
                    <p className="mt-1 text-xs text-foreground">الكمية: {line.quantity}</p>
                  </div>
                  <strong className="shrink-0 text-primary">{formatSYP(line.lineTotal)}</strong>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 rounded-2xl border border-foreground/10 bg-black/15 p-4 text-sm">
              <div className="flex items-center justify-between gap-3"><span className="text-foreground">مجموع الوجبات</span><strong>{formatSYP(subtotal)}</strong></div>
              {couponApplied && <div className="flex items-center justify-between gap-3 text-emerald-300"><span>الخصم</span><strong>-{formatSYP(discount)}</strong></div>}
              <div className="flex items-center justify-between gap-3"><span className="text-foreground">التوصيل</span><strong>{formatSYP(deliveryFee ?? 0)}</strong></div>
              <div className="border-t border-foreground/10 pt-3">
                <div className="flex items-center justify-between gap-3 text-base"><span className="font-bold">المجموع الكلي</span><strong className="text-xl text-primary">{formatSYP(total)}</strong></div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs leading-6 text-foreground">تأكد من الأصناف والموقع، ثم اضغط للانتقال إلى واتساب.</p>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" onClick={() => setSummaryOpen(false)} className="flex-1 rounded-xl border border-foreground/15 px-4 py-3.5 text-sm font-bold transition-colors hover:border-primary hover:text-primary">
                تعديل الطلب
              </button>
              <button type="button" onClick={() => void sendToWhatsApp()} className="flex-1 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-black text-[#071b0d] transition-transform hover:-translate-y-0.5">
                متابعة إلى واتساب
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}