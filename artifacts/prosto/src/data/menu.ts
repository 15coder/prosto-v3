import img4 from "@assets/mazen_al.nezaa__official_20260802_111346_510_1785659366927.jpg";
import img7 from "@assets/prosto_restaurant.2026_20260802_111334_297_1785659366951.jpg";
import img8 from "@assets/prosto_restaurant.2026_20260802_111327_237_1785659366960.jpg";
import img10 from "@assets/prosto_restaurant.2026_20260802_111325_014_1785659366981.jpg";
import img12 from "@assets/prosto_restaurant.2026_20260802_111323_212_1785659366994.jpg";
import burgerImg1 from "@assets/برغر١_1785779651107.jpg";
import burgerImg2 from "@assets/برغر٢_1785779651119.jpg";
import burgerImg3 from "@assets/برغر٣_1785779651068.jpg";
import pizzaImg1 from "@assets/بيتزا١_1785779841029.jpg";
import pizzaImg2 from "@assets/بيتزا٢_1785779841015.jpg";
import pizzaImg3 from "@assets/بيتزا٣_1785779841002.jpg";
import pizzaImg4 from "@assets/بيتزا٤_1785779840989.jpg";
import pizzaImg5 from "@assets/بيتزا٥_1785779841023.jpg";

export type MenuCategory = "دجاج" | "برغر" | "بيتزا" | "وجبات جانبية";

export type MenuItem = {
  id: string;
  category: MenuCategory;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  image: string;
};

// أسعار افتتاحية قابلة للتعديل من هذا الملف عندما تعتمد الإدارة القائمة النهائية.
export const menuItems: MenuItem[] = [
  {
    id: "chicken-crispy",
    category: "دجاج",
    name: "دبابيس دجاج مقرمشة",
    nameEn: "Crispy Chicken",
    description: "قطع دجاج ذهبية ومقرمشة مع صوص بروستو",
    price: 22000,
    image: img4,
  },
  {
    id: "shawarma",
    category: "دجاج",
    name: "شاورما بروستو",
    nameEn: "Prosto Shawarma",
    description: "شاورما متبلة بخبز طازج وخضار وصوص خاص",
    price: 18000,
    image: img12,
  },
  {
    id: "cordon-bleu",
    category: "دجاج",
    name: "كوردون بلو",
    nameEn: "Cordon Bleu",
    description: "دجاج محشو بالجبنة ومغطى بقرمشة ذهبية",
    price: 28000,
    image: img10,
  },
  {
    id: "prosto-burger",
    category: "برغر",
    name: "برغر بروستو",
    nameEn: "Prosto Burger",
    description: "برغر غني بالعصارة مع جبنة وصوص بروستو",
    price: 28000,
    image: burgerImg1,
  },
  {
    id: "classic-burger",
    category: "برغر",
    name: "برغر كلاسيك",
    nameEn: "Classic Burger",
    description: "لحم مشوي وخضار طازجة داخل خبز طري",
    price: 24000,
    image: burgerImg2,
  },
  {
    id: "cheese-burger",
    category: "برغر",
    name: "تشيز برغر",
    nameEn: "Cheese Burger",
    description: "لحم مشوي مع جبنة ذائبة وصوص خاص",
    price: 26000,
    image: burgerImg3,
  },
  {
    id: "chicken-pizza",
    category: "بيتزا",
    name: "بيتزا دجاج",
    nameEn: "Chicken Pizza",
    description: "دجاج متبل وجبنة ذائبة على عجينة بروستو",
    price: 32000,
    image: pizzaImg1,
  },
  {
    id: "vegetable-pizza",
    category: "بيتزا",
    name: "بيتزا خضار",
    nameEn: "Vegetable Pizza",
    description: "تشكيلة خضار طازجة مع جبنة غنية",
    price: 28000,
    image: pizzaImg2,
  },
  {
    id: "mixed-pizza",
    category: "بيتزا",
    name: "بيتزا مشكلة",
    nameEn: "Mixed Pizza",
    description: "خلطة بروستو المميزة لعشاق النكهات المتنوعة",
    price: 36000,
    image: pizzaImg3,
  },
  {
    id: "cheese-pizza",
    category: "بيتزا",
    name: "بيتزا جبنة",
    nameEn: "Cheese Pizza",
    description: "جبنة ذائبة بطبقة غنية على عجينة طازجة",
    price: 30000,
    image: pizzaImg4,
  },
  {
    id: "fries",
    category: "وجبات جانبية",
    name: "بطاطا بروستو",
    nameEn: "Prosto Fries",
    description: "بطاطا مقرمشة مع بهارات وصوص خاص",
    price: 10000,
    image: pizzaImg5,
  },
  {
    id: "fajita",
    category: "وجبات جانبية",
    name: "فاهيتا",
    nameEn: "Fajita",
    description: "شرائح دجاج وخضار بصوص الفاهيتا",
    price: 22000,
    image: img8,
  },
];

export const menuCategories: MenuCategory[] = ["دجاج", "برغر", "بيتزا", "وجبات جانبية"];