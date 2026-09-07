import { randomBytes } from "node:crypto";
import { Router, type IRouter } from "express";

type OrderItem = {
  name: string;
  quantity: number;
  lineTotal: number;
};

type TelegramOrderRequest = {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  distanceKm: number;
  billableKilometers: number;
  latitude: number;
  longitude: number;
  couponCode?: string;
};

const router: IRouter = Router();

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isValidOrder = (body: unknown): body is TelegramOrderRequest => {
  if (!body || typeof body !== "object") return false;

  const order = body as Partial<TelegramOrderRequest>;
  if (
    !Array.isArray(order.items) ||
    order.items.length === 0 ||
    order.items.length > 50 ||
    !isFiniteNumber(order.subtotal) ||
    !isFiniteNumber(order.discount) ||
    !isFiniteNumber(order.deliveryFee) ||
    !isFiniteNumber(order.total) ||
    !isFiniteNumber(order.distanceKm) ||
    !isFiniteNumber(order.billableKilometers) ||
    !isFiniteNumber(order.latitude) ||
    !isFiniteNumber(order.longitude)
  ) {
    return false;
  }

  return order.items.every(
    (item) =>
      item &&
      typeof item.name === "string" &&
      item.name.trim().length > 0 &&
      item.name.length <= 200 &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 100 &&
      isFiniteNumber(item.lineTotal),
  );
};

const formatSYP = (amount: number) =>
  `${new Intl.NumberFormat("en-US", { numberingSystem: "latn" }).format(Math.round(amount))} ل.س`;

const formatDistance = (distance: number) =>
  `${new Intl.NumberFormat("en-US", {
    numberingSystem: "latn",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(distance)} كم`;

const createTelegramMessage = (
  order: TelegramOrderRequest,
  verificationCode: string,
) => {
  const mapLink = `https://www.google.com/maps?q=${order.latitude},${order.longitude}`;
  const timestamp = new Intl.DateTimeFormat("en-US", {
    numberingSystem: "latn",
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Damascus",
  }).format(new Date());

  return [
    "🍔 PROSTO — طلب جديد",
    "━━━━━━━━━━━━━━",
    `رمز المطابقة: ${verificationCode}`,
    `وقت الطلب: ${timestamp}`,
    "",
    "الأصناف:",
    ...order.items.map(
      (item) => `• ${item.name} × ${item.quantity} = ${formatSYP(item.lineTotal)}`,
    ),
    "",
    `المجموع الفرعي: ${formatSYP(order.subtotal)}`,
    ...(order.couponCode
      ? [`كود الخصم: ${order.couponCode}`, `قيمة الخصم: -${formatSYP(order.discount)}`]
      : []),
    `المسافة: ${formatDistance(order.distanceKm)}`,
    `الكيلومترات المحاسبية: ${order.billableKilometers} كم`,
    `أجرة التوصيل: ${formatSYP(order.deliveryFee)}`,
    `المجموع الكلي: ${formatSYP(order.total)}`,
    "",
    `موقع الزبون: ${mapLink}`,
    "",
    "هذه هي النسخة الرسمية للمقارنة مع رسالة واتساب.",
  ].join("\n");
};

router.post("/telegram/order", async (req, res) => {
  if (!isValidOrder(req.body)) {
    res.status(400).json({ ok: false, message: "بيانات الطلب غير صالحة." });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    req.log.error("Telegram integration is not configured");
    res.status(503).json({ ok: false, message: "خدمة التحقق غير مهيأة حالياً." });
    return;
  }

  const verificationCode = randomBytes(4).toString("hex").toUpperCase();
  const telegramMessage = createTelegramMessage(req.body, verificationCode);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      req.log.error({ statusCode: response.status }, "Telegram API rejected order");
      res.status(502).json({ ok: false, message: "تعذر إرسال نسخة التحقق إلى تليجرام." });
      return;
    }

    const result = (await response.json()) as { ok?: boolean };
    if (!result.ok) {
      req.log.error("Telegram API returned an unsuccessful response");
      res.status(502).json({ ok: false, message: "تعذر إرسال نسخة التحقق إلى تليجرام." });
      return;
    }

    res.json({ ok: true, verificationCode });
  } catch (error) {
    req.log.error({ err: error }, "Telegram API request failed");
    res.status(502).json({ ok: false, message: "تعذر الاتصال بخدمة التحقق." });
  }
});

export default router;