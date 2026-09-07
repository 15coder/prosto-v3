import { menuItems, type MenuItem } from "@/data/menu";

export type CartQuantities = Record<string, number>;
export type CartLine = MenuItem & { quantity: number; lineTotal: number };

export const CART_STORAGE_KEY = "prosto-cart-v1";

export const formatSYP = (amount: number) =>
  `${new Intl.NumberFormat("en-US", { numberingSystem: "latn" }).format(Math.round(amount))} ل.س`;

export function readCart(): CartQuantities {
  if (typeof window === "undefined") return {};

  try {
    const stored = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "{}");
    if (!stored || typeof stored !== "object") return {};

    return Object.fromEntries(
      Object.entries(stored).filter(([, quantity]) => Number.isInteger(quantity) && Number(quantity) > 0),
    ) as CartQuantities;
  } catch {
    return {};
  }
}

export function getCartLines(cart: CartQuantities): CartLine[] {
  return menuItems.flatMap((item) => {
    const quantity = cart[item.id] ?? 0;
    return quantity > 0
      ? [{ ...item, quantity, lineTotal: item.price * quantity }]
      : [];
  });
}

export function getCartTotal(cart: CartQuantities) {
  return getCartLines(cart).reduce((total, line) => total + line.lineTotal, 0);
}

export function getCartCount(cart: CartQuantities) {
  return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}