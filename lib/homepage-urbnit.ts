import type { CourseSoftwareTool, HomepageFaq, HomepageSetting, PackCategory } from "@/lib/types";
import {
  URBNIT_COURSES_PROMO_IMAGES,
  URBNIT_DEFAULT_HEADER_LOGO,
  URBNIT_FACEBOOK_PROMO_IMAGE,
  URBNIT_HERO_GALLERY_IMAGES,
  URBNIT_HERO_TEACHER_IMAGE_1,
  URBNIT_HERO_TEACHER_IMAGE_2,
  URBNIT_PACKS_PROMO_IMAGE,
  URBNIT_TOP_BANNER_IMAGES,
  URBNIT_WHATSAPP_SUPPORT_URL,
  URBNIT_PAGE_TITLE_AR,
  URBNIT_PAGE_TITLE_EN,
} from "@/lib/homepage-known-defaults";

export const PACK_CATEGORIES: { id: PackCategory; labelEn: string; labelAr: string }[] = [
  { id: "all", labelEn: "All", labelAr: "الكل" },
  { id: "textures", labelEn: "Textures", labelAr: "الخامات" },
  { id: "people", labelEn: "People", labelAr: "الأشخاص" },
  { id: "objects", labelEn: "Objects", labelAr: "العناصر" },
  { id: "rhino", labelEn: "Rhino", labelAr: "Rhino" },
  { id: "bundles", labelEn: "Bundles", labelAr: "الباقات" },
  { id: "free", labelEn: "Free", labelAr: "مجاني" },
];

export function parseImageUrlArray(raw: string | null | undefined, max = 24): string[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((v) => String(v ?? "").trim())
      .filter(Boolean)
      .slice(0, max);
  } catch {
    return [];
  }
}

export function stringifyImageUrlArray(urls: string[], max = 24): string {
  return JSON.stringify(
    urls
      .map((u) => String(u ?? "").trim())
      .filter(Boolean)
      .slice(0, max),
  );
}

export function resolveHeroGalleryImages(raw: string | null | undefined, max = 20): string[] {
  const parsed = parseImageUrlArray(raw, max);
  return parsed.length > 0 ? parsed : [...URBNIT_HERO_GALLERY_IMAGES].slice(0, max);
}

export function resolveHeaderLogoUrl(raw: string | null | undefined): string {
  const url = raw?.trim();
  return url || URBNIT_DEFAULT_HEADER_LOGO;
}

export function resolveHeroTeacherImages(settings: {
  heroFloatImage1?: string | null;
  heroFloatImage2?: string | null;
}): [string, string] {
  const first = settings.heroFloatImage1?.trim();
  const second = settings.heroFloatImage2?.trim();
  return [first || URBNIT_HERO_TEACHER_IMAGE_1, second || URBNIT_HERO_TEACHER_IMAGE_2];
}

/** Normalize a phone number or wa.me / api.whatsapp URL into a WhatsApp chat link. */
export function toWhatsappHref(raw: string | null | undefined, fallback = URBNIT_WHATSAPP_SUPPORT_URL): string {
  const value = raw?.trim();
  if (!value) return fallback;
  if (/^https?:\/\//i.test(value)) return value;

  let digits = value.replace(/\D+/g, "");
  if (!digits) return fallback;

  // Egyptian local mobile: 01xxxxxxxxx → 201xxxxxxxxx
  if (digits.startsWith("0") && digits.length >= 10) {
    digits = `20${digits.slice(1)}`;
  }

  return `https://wa.me/${digits}`;
}

export function resolveWhatsappSupportUrl(raw: string | null | undefined): string {
  return toWhatsappHref(raw, URBNIT_WHATSAPP_SUPPORT_URL);
}

const LEGACY_PAGE_TITLES = new Set([
  "منصتي التعليمية",
  "منصتي التعليمية | دورات وتعلم أونلاين",
  "My Learning Platform",
  "My Learning Platform | Courses and Online Learning",
  "urbnit studio | Architectural Representation",
  "urbnit studio | التمثيل المعماري",
]);

export function resolvePageTitle(
  locale: "ar" | "en",
  pageTitle?: string | null,
  pageTitleEn?: string | null,
): string {
  const raw = (locale === "ar" ? pageTitle : pageTitleEn)?.trim();
  const fallback = locale === "ar" ? URBNIT_PAGE_TITLE_AR : URBNIT_PAGE_TITLE_EN;
  if (!raw || LEGACY_PAGE_TITLES.has(raw)) return fallback;
  return raw;
}

/** Show a friendly phone number in admin when the stored value is a wa.me link. */
export function formatWhatsappSupportInput(raw: string | null | undefined): string {
  const value = raw?.trim();
  if (!value) return "";
  const waMatch = value.match(/wa\.me\/(\d+)/i);
  if (waMatch) {
    const digits = waMatch[1];
    if (digits.startsWith("20") && digits.length >= 12) {
      return `0${digits.slice(2)}`;
    }
    return digits;
  }
  return value;
}

export function resolveTopBannerImages(raw: string | null | undefined, max = 12): string[] {
  return parseImageUrlArray(raw, max);
}

const BROKEN_UNSPLASH_IMAGE_ID = "1517245386807-bb7fd0c33129";

function sanitizePromoImageUrl(url: string, fallback: string): string {
  return url.includes(BROKEN_UNSPLASH_IMAGE_ID) ? fallback : url;
}

export function resolveCoursesPromoImages(raw: string | null | undefined, max = 4): string[] {
  const defaults = [...URBNIT_COURSES_PROMO_IMAGES].slice(0, max);
  const parsed = parseImageUrlArray(raw, max).map((url, i) =>
    sanitizePromoImageUrl(url, defaults[i] ?? defaults[0] ?? url),
  );
  if (parsed.length === 0) return defaults;
  return Array.from({ length: max }, (_, i) => parsed[i] || defaults[i] || defaults[0]).filter(Boolean);
}

export function resolvePacksPromoImageUrl(raw: string | null | undefined): string {
  const url = raw?.trim();
  return url || URBNIT_PACKS_PROMO_IMAGE;
}

export function resolveFacebookPromoImageUrl(raw: string | null | undefined): string {
  const url = raw?.trim();
  return url || URBNIT_FACEBOOK_PROMO_IMAGE;
}

export function parseSoftwareTools(raw: string | null | undefined): CourseSoftwareTool[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const items: CourseSoftwareTool[] = [];
    for (let i = 0; i < parsed.length && items.length < 8; i++) {
      const item = parsed[i];
      if (!item || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      const label = String(o.label ?? "").trim();
      if (!label) continue;
      const iconUrl = String(o.iconUrl ?? o.icon_url ?? "").trim();
      items.push({
        id: String(o.id ?? `tool-${i + 1}`).trim() || `tool-${i + 1}`,
        label: label.slice(0, 40),
        iconUrl: iconUrl ? iconUrl.slice(0, 4000) : null,
      });
    }
    return items;
  } catch {
    return [];
  }
}

export function stringifySoftwareTools(tools: CourseSoftwareTool[]): string {
  return JSON.stringify(
    tools
      .map((t, i) => ({
        id: (t.id || `tool-${i + 1}`).slice(0, 64),
        label: t.label.trim().slice(0, 40),
        iconUrl: t.iconUrl?.trim() ? t.iconUrl.trim().slice(0, 4000) : null,
      }))
      .filter((t) => t.label),
  );
}

export const URBNIT_DEFAULT_FAQS: Omit<HomepageFaq, "createdAt" | "updatedAt">[] = [
  {
    id: "faq-1",
    question: "ما هي منصة urbnit studio؟",
    questionEn: "What is the urbnit studio platform?",
    answer: "منصة تعليمية متخصصة في التمثيل المعماري والتصور البصري للمعماريين.",
    answerEn:
      "A learning platform focused on architectural representation and visualization for architects.",
    sortOrder: 1,
  },
  {
    id: "faq-2",
    question: "ما الذي يميز دورات urbnit studio؟",
    questionEn: "What makes urbnit studio courses unique?",
    answer: "دورات عملية تركز على سير العمل الرقمي من البداية حتى العرض النهائي.",
    answerEn: "Practical courses focused on digital workflows from start to final presentation.",
    sortOrder: 2,
  },
  {
    id: "faq-3",
    question: "كم مدة الوصول لمواد الدورة؟",
    questionEn: "How long do I have access to course materials?",
    answer: "تحصل على وصول كامل للمواد بعد التسجيل وفق سياسة المنصة.",
    answerEn: "You get full access to materials after enrollment according to platform policy.",
    sortOrder: 3,
  },
];
