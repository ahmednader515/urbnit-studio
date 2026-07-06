import type { HomepageFaq, HomepageSetting } from "./types";
import {
  URBNIT_COURSES_PAGE_INTRO_AR,
  URBNIT_COURSES_PAGE_INTRO_EN,
  URBNIT_COURSES_PAGE_TITLE_AR,
  URBNIT_COURSES_PAGE_TITLE_EN,
  URBNIT_COURSES_PROMO_BODY_AR,
  URBNIT_COURSES_PROMO_BODY_EN,
  URBNIT_COURSES_PROMO_TITLE_AR,
  URBNIT_COURSES_PROMO_TITLE_EN,
  URBNIT_FAQ_SUBTITLE_AR,
  URBNIT_FAQ_SUBTITLE_EN,
  URBNIT_FAQ_TITLE_AR,
  URBNIT_FAQ_TITLE_EN,
  URBNIT_FOOTER_COPYRIGHT_AR,
  URBNIT_FOOTER_MISSION_AR,
  URBNIT_FOOTER_MISSION_EN,
  URBNIT_HERO_SLOGAN_AR,
  URBNIT_HERO_SLOGAN_EN,
  URBNIT_HERO_TITLE_AR,
  URBNIT_HERO_TITLE_EN,
  URBNIT_PACKS_PAGE_DESCRIPTION_AR,
  URBNIT_PACKS_PAGE_DESCRIPTION_EN,
  URBNIT_PACKS_PAGE_SUBTITLE_AR,
  URBNIT_PACKS_PAGE_SUBTITLE_EN,
  URBNIT_PACKS_PAGE_TITLE_AR,
  URBNIT_PACKS_PAGE_TITLE_EN,
  URBNIT_PACKS_PROMO_BODY_AR,
  URBNIT_PACKS_PROMO_BODY_EN,
  URBNIT_PACKS_PROMO_TITLE_AR,
  URBNIT_PACKS_PROMO_TITLE_EN,
  URBNIT_PLATFORM_NAME_AR,
  URBNIT_FACEBOOK_PROMO_BODY_AR,
  URBNIT_FACEBOOK_PROMO_BODY_EN,
  URBNIT_FACEBOOK_PROMO_TITLE_AR,
  URBNIT_FACEBOOK_PROMO_TITLE_EN,
  URBNIT_HERO_GALLERY_IMAGES,
  URBNIT_COURSES_PROMO_IMAGES,
  URBNIT_PACKS_PROMO_IMAGE,
  URBNIT_FACEBOOK_PROMO_IMAGE,
  URBNIT_ABOUT_BODY_AR,
  URBNIT_ABOUT_BODY_EN,
  URBNIT_FOOTER_COPYRIGHT_EN,
  URBNIT_PAGE_TITLE_EN,
  URBNIT_PAGE_TITLE_AR,
  URBNIT_DEFAULT_HEADER_LOGO,
  URBNIT_HERO_TEACHER_IMAGE_1,
  URBNIT_HERO_TEACHER_IMAGE_2,
  URBNIT_WHATSAPP_SUPPORT_URL,
} from "./homepage-known-defaults";
import {
  URBNIT_DEFAULT_FAQS,
  resolveCoursesPromoImages,
  resolveFacebookPromoImageUrl,
  resolveHeroGalleryImages,
  resolvePacksPromoImageUrl,
  resolveTopBannerImages,
  stringifyImageUrlArray,
} from "./homepage-urbnit";

export const URBNIT_HOMEPAGE_DEFAULTS: Partial<HomepageSetting> = {
  heroTemplate: "urbnit",
  platformName: URBNIT_PLATFORM_NAME_AR,
  platformNameEn: "urbnit studio",
  heroTitle: URBNIT_HERO_TITLE_AR,
  heroTitleEn: URBNIT_HERO_TITLE_EN,
  heroSlogan: URBNIT_HERO_SLOGAN_AR,
  heroSloganEn: URBNIT_HERO_SLOGAN_EN,
  heroCtaPrimaryText: "الدورات",
  heroCtaPrimaryTextEn: "Courses",
  heroCtaPrimaryHref: "/courses",
  heroCtaSecondaryText: "الحزم",
  heroCtaSecondaryTextEn: "Packs",
  heroCtaSecondaryHref: "/packs",
  headerLogoUrl: URBNIT_DEFAULT_HEADER_LOGO,
  teacherImageUrl: URBNIT_HERO_TEACHER_IMAGE_1,
  heroFloatImage1: URBNIT_HERO_TEACHER_IMAGE_1,
  heroFloatImage2: URBNIT_HERO_TEACHER_IMAGE_2,
  heroGalleryImages: stringifyImageUrlArray([...URBNIT_HERO_GALLERY_IMAGES]),
  topBannerImages: "[]",
  coursesPromoImages: stringifyImageUrlArray([...URBNIT_COURSES_PROMO_IMAGES]),
  coursesPromoTitle: URBNIT_COURSES_PROMO_TITLE_AR,
  coursesPromoTitleEn: URBNIT_COURSES_PROMO_TITLE_EN,
  coursesPromoBody: URBNIT_COURSES_PROMO_BODY_AR,
  coursesPromoBodyEn: URBNIT_COURSES_PROMO_BODY_EN,
  coursesPromoCtaText: "اعرف المزيد عن دوراتنا",
  coursesPromoCtaTextEn: "Learn more about our Courses",
  coursesPromoCtaHref: "/courses",
  packsPromoTitle: URBNIT_PACKS_PROMO_TITLE_AR,
  packsPromoTitleEn: URBNIT_PACKS_PROMO_TITLE_EN,
  packsPromoBody: URBNIT_PACKS_PROMO_BODY_AR,
  packsPromoBodyEn: URBNIT_PACKS_PROMO_BODY_EN,
  packsPromoCtaText: "اعرف المزيد عن حزمنا",
  packsPromoCtaTextEn: "Learn more about our Packs",
  packsPromoCtaHref: "/packs",
  packsPromoImageUrl: URBNIT_PACKS_PROMO_IMAGE,
  youtubePromoImageUrl: URBNIT_FACEBOOK_PROMO_IMAGE,
  youtubePromoTitle: URBNIT_FACEBOOK_PROMO_TITLE_AR,
  youtubePromoTitleEn: URBNIT_FACEBOOK_PROMO_TITLE_EN,
  youtubePromoBody: URBNIT_FACEBOOK_PROMO_BODY_AR,
  youtubePromoBodyEn: URBNIT_FACEBOOK_PROMO_BODY_EN,
  youtubePromoCtaText: "تابعنا على فيسبوك",
  youtubePromoCtaTextEn: "Check out urbnit studio on Facebook",
  faqTitle: URBNIT_FAQ_TITLE_AR,
  faqTitleEn: URBNIT_FAQ_TITLE_EN,
  faqSubtitle: URBNIT_FAQ_SUBTITLE_AR,
  faqSubtitleEn: URBNIT_FAQ_SUBTITLE_EN,
  footerMission: URBNIT_FOOTER_MISSION_AR,
  footerMissionEn: URBNIT_FOOTER_MISSION_EN,
  footerCopyright: URBNIT_FOOTER_COPYRIGHT_AR,
  footerCopyrightEn: URBNIT_FOOTER_COPYRIGHT_EN,
  coursesPageTitle: URBNIT_COURSES_PAGE_TITLE_AR,
  coursesPageTitleEn: URBNIT_COURSES_PAGE_TITLE_EN,
  coursesPageIntro: URBNIT_COURSES_PAGE_INTRO_AR,
  coursesPageIntroEn: URBNIT_COURSES_PAGE_INTRO_EN,
  packsPageTitle: URBNIT_PACKS_PAGE_TITLE_AR,
  packsPageTitleEn: URBNIT_PACKS_PAGE_TITLE_EN,
  packsPageSubtitle: URBNIT_PACKS_PAGE_SUBTITLE_AR,
  packsPageSubtitleEn: URBNIT_PACKS_PAGE_SUBTITLE_EN,
  packsPageDescription: URBNIT_PACKS_PAGE_DESCRIPTION_AR,
  packsPageDescriptionEn: URBNIT_PACKS_PAGE_DESCRIPTION_EN,
  aboutTitle: "من نحن",
  aboutTitleEn: "About",
  aboutBody: URBNIT_ABOUT_BODY_AR,
  aboutBodyEn: URBNIT_ABOUT_BODY_EN,
  pageTitle: URBNIT_PAGE_TITLE_AR,
  pageTitleEn: URBNIT_PAGE_TITLE_EN,
  whatsappUrl: URBNIT_WHATSAPP_SUPPORT_URL,
  storeEnabled: true,
};

function readStr(row: Record<string, unknown>, snake: string, max = 4000): string | null {
  const v = row[snake];
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s.slice(0, max) : null;
}

function readStrWithDefault(
  row: Record<string, unknown>,
  snake: string,
  max: number,
  fallback?: string | null,
): string | null {
  return readStr(row, snake, max) ?? fallback ?? null;
}

export function readUrbnitFieldsFromRow(row: Record<string, unknown>): Partial<HomepageSetting> {
  const d = URBNIT_HOMEPAGE_DEFAULTS;
  return {
    heroGalleryImages: stringifyImageUrlArray(
      resolveHeroGalleryImages(readStr(row, "hero_gallery_images", 50000) ?? d.heroGalleryImages),
    ),
    heroCtaPrimaryText: readStrWithDefault(row, "hero_cta_primary_text", 120, d.heroCtaPrimaryText),
    heroCtaPrimaryTextEn: readStrWithDefault(row, "hero_cta_primary_text_en", 120, d.heroCtaPrimaryTextEn),
    heroCtaPrimaryHref: readStrWithDefault(row, "hero_cta_primary_href", 500, d.heroCtaPrimaryHref),
    heroCtaSecondaryText: readStrWithDefault(row, "hero_cta_secondary_text", 120, d.heroCtaSecondaryText),
    heroCtaSecondaryTextEn: readStrWithDefault(row, "hero_cta_secondary_text_en", 120, d.heroCtaSecondaryTextEn),
    heroCtaSecondaryHref: readStrWithDefault(row, "hero_cta_secondary_href", 500, d.heroCtaSecondaryHref),
    topBannerImages: stringifyImageUrlArray(
      resolveTopBannerImages(readStr(row, "top_banner_images", 50000) ?? d.topBannerImages),
    ),
    coursesPromoImages: stringifyImageUrlArray(
      resolveCoursesPromoImages(readStr(row, "courses_promo_images", 20000) ?? d.coursesPromoImages),
    ),
    coursesPromoTitle: readStrWithDefault(row, "courses_promo_title", 500, d.coursesPromoTitle),
    coursesPromoTitleEn: readStrWithDefault(row, "courses_promo_title_en", 500, d.coursesPromoTitleEn),
    coursesPromoBody: readStrWithDefault(row, "courses_promo_body", 3000, d.coursesPromoBody),
    coursesPromoBodyEn: readStrWithDefault(row, "courses_promo_body_en", 3000, d.coursesPromoBodyEn),
    coursesPromoCtaText: readStrWithDefault(row, "courses_promo_cta_text", 200, d.coursesPromoCtaText),
    coursesPromoCtaTextEn: readStrWithDefault(row, "courses_promo_cta_text_en", 200, d.coursesPromoCtaTextEn),
    coursesPromoCtaHref: readStrWithDefault(row, "courses_promo_cta_href", 500, d.coursesPromoCtaHref),
    packsPromoImageUrl: resolvePacksPromoImageUrl(readStr(row, "packs_promo_image_url", 4000)),
    packsPromoTitle: readStrWithDefault(row, "packs_promo_title", 500, d.packsPromoTitle),
    packsPromoTitleEn: readStrWithDefault(row, "packs_promo_title_en", 500, d.packsPromoTitleEn),
    packsPromoBody: readStrWithDefault(row, "packs_promo_body", 3000, d.packsPromoBody),
    packsPromoBodyEn: readStrWithDefault(row, "packs_promo_body_en", 3000, d.packsPromoBodyEn),
    packsPromoCtaText: readStrWithDefault(row, "packs_promo_cta_text", 200, d.packsPromoCtaText),
    packsPromoCtaTextEn: readStrWithDefault(row, "packs_promo_cta_text_en", 200, d.packsPromoCtaTextEn),
    packsPromoCtaHref: readStrWithDefault(row, "packs_promo_cta_href", 500, d.packsPromoCtaHref),
    youtubePromoImageUrl: resolveFacebookPromoImageUrl(readStr(row, "youtube_promo_image_url", 4000)),
    youtubePromoTitle: readStrWithDefault(row, "youtube_promo_title", 300, d.youtubePromoTitle),
    youtubePromoTitleEn: readStrWithDefault(row, "youtube_promo_title_en", 300, d.youtubePromoTitleEn),
    youtubePromoBody: readStrWithDefault(row, "youtube_promo_body", 3000, d.youtubePromoBody),
    youtubePromoBodyEn: readStrWithDefault(row, "youtube_promo_body_en", 3000, d.youtubePromoBodyEn),
    youtubePromoCtaText: readStrWithDefault(row, "youtube_promo_cta_text", 200, d.youtubePromoCtaText),
    youtubePromoCtaTextEn: readStrWithDefault(row, "youtube_promo_cta_text_en", 200, d.youtubePromoCtaTextEn),
    faqTitle: readStrWithDefault(row, "faq_title", 300, d.faqTitle),
    faqTitleEn: readStrWithDefault(row, "faq_title_en", 300, d.faqTitleEn),
    faqSubtitle: readStrWithDefault(row, "faq_subtitle", 500, d.faqSubtitle),
    faqSubtitleEn: readStrWithDefault(row, "faq_subtitle_en", 500, d.faqSubtitleEn),
    footerMission: readStrWithDefault(row, "footer_mission", 1000, d.footerMission),
    footerMissionEn: readStrWithDefault(row, "footer_mission_en", 1000, d.footerMissionEn),
    footerCopyrightEn: readStrWithDefault(row, "footer_copyright_en", 500, d.footerCopyrightEn),
    instagramUrl: readStr(row, "instagram_url", 4000),
    pinterestUrl: readStr(row, "pinterest_url", 4000),
    coursesPageTitle: readStrWithDefault(row, "courses_page_title", 200, d.coursesPageTitle),
    coursesPageTitleEn: readStrWithDefault(row, "courses_page_title_en", 200, d.coursesPageTitleEn),
    coursesPageIntro: readStrWithDefault(row, "courses_page_intro", 3000, d.coursesPageIntro),
    coursesPageIntroEn: readStrWithDefault(row, "courses_page_intro_en", 3000, d.coursesPageIntroEn),
    packsPageTitle: readStrWithDefault(row, "packs_page_title", 200, d.packsPageTitle),
    packsPageTitleEn: readStrWithDefault(row, "packs_page_title_en", 200, d.packsPageTitleEn),
    packsPageSubtitle: readStrWithDefault(row, "packs_page_subtitle", 500, d.packsPageSubtitle),
    packsPageSubtitleEn: readStrWithDefault(row, "packs_page_subtitle_en", 500, d.packsPageSubtitleEn),
    packsPageDescription: readStrWithDefault(row, "packs_page_description", 3000, d.packsPageDescription),
    packsPageDescriptionEn: readStrWithDefault(row, "packs_page_description_en", 3000, d.packsPageDescriptionEn),
    aboutTitle: readStrWithDefault(row, "about_title", 300, d.aboutTitle),
    aboutTitleEn: readStrWithDefault(row, "about_title_en", 300, d.aboutTitleEn),
    aboutBody: readStrWithDefault(row, "about_body", 10000, d.aboutBody),
    aboutBodyEn: readStrWithDefault(row, "about_body_en", 10000, d.aboutBodyEn),
  };
}

export type UrbnitHomepageUpdate = {
  hero_gallery_images?: string | null;
  hero_cta_primary_text?: string | null;
  hero_cta_primary_text_en?: string | null;
  hero_cta_primary_href?: string | null;
  hero_cta_secondary_text?: string | null;
  hero_cta_secondary_text_en?: string | null;
  hero_cta_secondary_href?: string | null;
  top_banner_images?: string | null;
  courses_promo_images?: string | null;
  courses_promo_title?: string | null;
  courses_promo_title_en?: string | null;
  courses_promo_body?: string | null;
  courses_promo_body_en?: string | null;
  courses_promo_cta_text?: string | null;
  courses_promo_cta_text_en?: string | null;
  courses_promo_cta_href?: string | null;
  packs_promo_image_url?: string | null;
  packs_promo_title?: string | null;
  packs_promo_title_en?: string | null;
  packs_promo_body?: string | null;
  packs_promo_body_en?: string | null;
  packs_promo_cta_text?: string | null;
  packs_promo_cta_text_en?: string | null;
  packs_promo_cta_href?: string | null;
  youtube_promo_image_url?: string | null;
  youtube_promo_title?: string | null;
  youtube_promo_title_en?: string | null;
  youtube_promo_body?: string | null;
  youtube_promo_body_en?: string | null;
  youtube_promo_cta_text?: string | null;
  youtube_promo_cta_text_en?: string | null;
  faq_title?: string | null;
  faq_title_en?: string | null;
  faq_subtitle?: string | null;
  faq_subtitle_en?: string | null;
  footer_mission?: string | null;
  footer_mission_en?: string | null;
  instagram_url?: string | null;
  pinterest_url?: string | null;
  courses_page_title?: string | null;
  courses_page_title_en?: string | null;
  courses_page_intro?: string | null;
  courses_page_intro_en?: string | null;
  packs_page_title?: string | null;
  packs_page_title_en?: string | null;
  packs_page_subtitle?: string | null;
  packs_page_subtitle_en?: string | null;
  packs_page_description?: string | null;
  packs_page_description_en?: string | null;
  about_title?: string | null;
  about_title_en?: string | null;
  about_body?: string | null;
  about_body_en?: string | null;
};

export function mapFaqRow(r: Record<string, unknown>): HomepageFaq {
  return {
    id: String(r.id),
    question: String(r.question ?? ""),
    questionEn: r.question_en ? String(r.question_en) : null,
    answer: String(r.answer ?? ""),
    answerEn: r.answer_en ? String(r.answer_en) : null,
    sortOrder: Number(r.sort_order ?? 0),
    createdAt:
      r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? ""),
    updatedAt:
      r.updated_at instanceof Date ? r.updated_at.toISOString() : String(r.updated_at ?? ""),
  };
}

export { URBNIT_DEFAULT_FAQS };
