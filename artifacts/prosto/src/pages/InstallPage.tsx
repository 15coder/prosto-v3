import { ArrowRight, CheckCircle2, Download, ExternalLink, Share2, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { RESTAURANT_HOURS_LABEL } from "@/components/RestaurantStatus";

export default function InstallPage() {
  const [, setLocation] = useLocation();
  const { canInstall, isInstalled, install } = usePwaInstall();

  return (
    <main dir="rtl" className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/85 backdrop-blur-2xl">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:text-primary"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للموقع
          </button>
          <a href="/" className="font-display text-xl font-black text-primary sm:text-2xl">
            PROSTO
          </a>
          <a
            href="/menu"
            className="hidden rounded-full border border-primary/30 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-black sm:inline-flex"
          >
            اطلب الآن
          </a>
        </div>
      </header>

      <section className="relative flex min-h-[calc(100dvh-73px)] items-center overflow-hidden py-12 sm:py-20">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-bold text-primary">
              <Smartphone className="h-4 w-4" />
              تطبيق بروستو
            </span>
            <h1 className="font-display text-4xl font-black leading-tight sm:text-6xl">
              خذ بروستو <span className="text-primary">معك دائماً</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-foreground sm:text-lg">
              ثبّت الموقع على شاشة هاتفك للوصول الأسرع إلى المنيو والطلب، حتى مع تجربة تشبه التطبيق الأصلي.
            </p>

            <div className="mx-auto mt-8 max-w-md rounded-3xl border border-primary/20 bg-white/[0.035] p-5 text-right shadow-2xl sm:p-7">
              {isInstalled ? (
                <div className="flex items-start gap-3 text-emerald-200">
                  <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-300" />
                  <div>
                    <h2 className="font-black">التطبيق مثبت على جهازك</h2>
                    <p className="mt-2 text-sm leading-6 text-foreground">يمكنك فتح بروستو مباشرة من الشاشة الرئيسية.</p>
                  </div>
                </div>
              ) : canInstall ? (
                <button
                  type="button"
                  onClick={() => void install()}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 py-4 font-black text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(245,200,0,0.35)]"
                >
                  <Download className="h-5 w-5" />
                  تثبيت التطبيق الآن
                </button>
              ) : (
                <div>
                  <h2 className="font-black">طريقة التثبيت</h2>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-foreground">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-black">١</span>
                      <p><strong className="text-foreground">Android / Chrome:</strong> افتح قائمة المتصفح ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-black">٢</span>
                      <p><strong className="text-foreground">iPhone / Safari:</strong> اضغط زر المشاركة ثم اختر «إضافة إلى الشاشة الرئيسية».</p>
                    </div>
                  </div>
                  <p className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 p-3 text-xs leading-6 text-foreground">
                    إذا لم يظهر خيار التثبيت، افتح هذه الصفحة من Chrome أو Safari مباشرة.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 grid gap-3 text-right sm:grid-cols-3">
              {[
                { icon: Download, title: "وصول أسرع", text: "افتح المنيو من الشاشة الرئيسية." },
                { icon: Share2, title: "طلب أسهل", text: "اطلب مباشرة عبر واتساب." },
                { icon: ExternalLink, title: "ساعات العمل", text: RESTAURANT_HOURS_LABEL },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-foreground/10 bg-white/[0.025] p-4">
                  <Icon className="mb-3 h-5 w-5 text-primary" />
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-foreground">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}