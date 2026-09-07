import { randomBytes } from "node:crypto";

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
  notes?: string;
};

type NetlifyEvent = {
  httpMethod: string;
  body: string | null;
  isBase64Encoded?: boolean;
};

type NetlifyResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
};

const jsonResponse = (
  statusCode: number,
  body: Record<string, unknown>,
): NetlifyResponse => ({
  statusCode,
  headers: jsonHeaders,
  body: JSON.stringify(body),
});

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

  if (
    order.latitude < -90 ||
    order.latitude > 90 ||
    order.longitude < -180 ||
    order.longitude > 180 ||
    (order.notes !== undefined &&
      (typeof order.notes !== "string" || order.notes.length > 1000))
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
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.latitude},${order.longitude}`)}`;
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
      ? [
          `كود الخصم: ${order.couponCode}`,
          `قيمة الخصم: -${formatSYP(order.discount)}`,
        ]
      : []),
    `المسافة: ${formatDistance(order.distanceKm)}`,
    `الكيلومترات المحاسبية: ${order.billableKilometers} كم`,
    `أجرة التوصيل: ${formatSYP(order.deliveryFee)}`,
    `المجموع الكلي: ${formatSYP(order.total)}`,
    "",
    `موقع الزبون: ${mapLink}`,
    ...(order.notes?.trim() ? ["", "ملاحظات الطلب:", order.notes.trim()] : []),
    "",
    "هذه هي النسخة الرسمية للمقارنة مع رسالة واتساب.",
  ].join("\n");
};

const decodeBody = (event: NetlifyEvent) => {
  if (!event.body) return null;
  if (!event.isBase64Encoded) return event.body;
  return Buffer.from(event.body, "base64").toString("utf8");
};

export const handler = async (
  event: NetlifyEvent,
): Promise<NetlifyResponse> => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      ok: false,
      message: "الطريقة غير مسموحة.",
    });
  }

  const rawBody = decodeBody(event);
  if (!rawBody || rawBody.length > 64 * 1024) {
    return jsonResponse(400, {
      ok: false,
      message: "بيانات الطلب غير صالحة.",
    });
  }

  let order: unknown;
  try {
    order = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, {
      ok: false,
      message: "بيانات الطلب غير صالحة.",
    });
  }

  if (!isValidOrder(order)) {
    return jsonResponse(400, {
      ok: false,
      message: "بيانات الطلب غير صالحة.",
    });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return jsonResponse(503, {
      ok: false,
      message: "خدمة التحقق غير مهيأة حالياً.",
    });
  }

  const verificationCode = randomBytes(4).toString("hex").toUpperCase();
  const telegramMessage = createTelegramMessage(order, verificationCode);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!response.ok) {
      return jsonResponse(502, {
        ok: false,
        message: "تعذر إرسال نسخة التحقق إلى تليجرام.",
      });
    }

    const result = (await response.json()) as { ok?: boolean };
    if (!result.ok) {
      return jsonResponse(502, {
        ok: false,
        message: "تعذر إرسال نسخة التحقق إلى تليجرام.",
      });
    }

    return jsonResponse(200, { ok: true, verificationCode });
  } catch {
    return jsonResponse(502, {
      ok: false,
      message: "تعذر الاتصال بخدمة التحقق.",
    });
  }
};