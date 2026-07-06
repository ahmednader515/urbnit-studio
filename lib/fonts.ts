import { Cairo, Plus_Jakarta_Sans } from "next/font/google";

export const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-latin",
  subsets: ["latin"],
  display: "swap",
});

export const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const fontVariables = `${plusJakarta.variable} ${cairo.variable}`;
