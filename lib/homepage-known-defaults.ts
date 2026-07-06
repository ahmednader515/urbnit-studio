/**
 * Urbnit studio homepage defaults — aligned with HOMEPAGE_DEFAULTS in lib/db.ts
 */
export const URBNIT_PLATFORM_NAME_EN = "urbnit studio";
export const URBNIT_PLATFORM_NAME_AR = "urbnit studio";

export const URBNIT_HERO_TITLE_EN =
  "Learn and practice Architectural Representation and Visualization.";
export const URBNIT_HERO_TITLE_AR =
  "تعلّم ومارس التمثيل المعماري والتصور البصري.";

export const URBNIT_HERO_SLOGAN_EN =
  "Join our premium courses, build your library of assets with our high-quality packs, and access free content on our Facebook page.";
export const URBNIT_HERO_SLOGAN_AR =
  "انضم لدوراتنا المميزة، وابنِ مكتبة أصولك مع حزمنا عالية الجودة، واستمتع بمحتوى مجاني على صفحتنا على فيسبوك.";

function unsplash(photoId: string, width = 800): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}

export function publicAssetPath(...segments: string[]): string {
  return `/images/${segments.map((s) => s.replace(/ /g, "%20")).join("/")}`;
}

function heroGalleryPath(filename: string): string {
  return publicAssetPath(filename);
}

/** Default WhatsApp support — Egypt +20 */
export const URBNIT_WHATSAPP_SUPPORT_NUMBER = "01016473419";
export const URBNIT_WHATSAPP_SUPPORT_URL = "https://wa.me/201016473419";

/** Default header wordmark — light theme */
export const URBNIT_DEFAULT_HEADER_LOGO = publicAssetPath("LOGO", "logo 6 .png");

/** Hero teacher portraits (stacked on the right) */
export const URBNIT_HERO_TEACHER_IMAGE_1 = publicAssetPath("IMAGE", "01.jpg");
export const URBNIT_HERO_TEACHER_IMAGE_2 = publicAssetPath("IMAGE", "02.jpg");

/** Default hero mosaic — 8 images in public/images */
export const URBNIT_HERO_GALLERY_IMAGES: readonly string[] = [
  heroGalleryPath("66c105abd7ebb68f9659a9c8_Upstairs Grid Image_Noise_A.avif"),
  heroGalleryPath("66c105ae1121c5920221a7ed_Upstairs Grid Image_Noise_B.avif"),
  heroGalleryPath("66c105afbffcf3768d6ac5f7_Upstairs Grid Image_Noise_C.avif"),
  heroGalleryPath("66c105b119a9bbe902e0f9cb_Upstairs Grid Image_Noise_D.avif"),
  heroGalleryPath("66c105b29fb59105a9eb93c0_Upstairs Grid Image_Noise_E.avif"),
  heroGalleryPath("66c105b5c8d628dba86886df_Upstairs Grid Image_Noise_G.avif"),
  heroGalleryPath("66c105c0d7ebb68f9659bf52_Upstairs Grid Image_Noise_O.avif"),
  heroGalleryPath("66c105c39fb59105a9eb9cca_Upstairs Grid Image_Noise_Q.avif"),
];

/** Top banner — empty by default (optional CMS strip above hero) */
export const URBNIT_TOP_BANNER_IMAGES: readonly string[] = [];

/** Courses promo grid — learning, design, and digital workflows */
export const URBNIT_COURSES_PROMO_IMAGES: readonly string[] = [
  unsplash("1522202176988-66273c2fd55f", 700),
  unsplash("1581091226825-a6a2a5aee158", 700),
  unsplash("1497366216548-37526070297c", 700),
  unsplash("1454165804606-c3d57bc86b40", 700),
];

export const URBNIT_PACKS_PROMO_IMAGE = unsplash("1558618666-fcd25c85cd64", 1200);

export const URBNIT_FACEBOOK_PROMO_IMAGE = unsplash("1522071820081-009f0129c71c", 1200);

export const URBNIT_ABOUT_BODY_EN =
  "urbnit studio is a learning platform dedicated to architectural representation and visualization. We help students and professionals master digital drawing, rendering, and presentation skills through premium courses, asset packs, and free community content.";
export const URBNIT_ABOUT_BODY_AR =
  "urbnit studio منصة تعليمية متخصصة في التمثيل المعماري والتصور البصري. نساعد الطلاب والمحترفين على إتقان الرسم الرقمي والعرض التقديمي من خلال دورات مميزة وحزم أصول ومحتوى مجتمعي.";

export const URBNIT_COURSES_PROMO_TITLE_EN =
  "Discover the world of architectural representation through our premium courses.";
export const URBNIT_COURSES_PROMO_TITLE_AR =
  "اكتشف عالم التمثيل المعماري من خلال دوراتنا المميزة.";

export const URBNIT_COURSES_PROMO_BODY_EN =
  "Whether you're a student looking to learn essential skills, a recent graduate navigating the professional world, or an aspiring architect needing a hand on your presentations, our courses focus on mastering the art of visual communication within the digital landscape.";
export const URBNIT_COURSES_PROMO_BODY_AR =
  "سواء كنت طالباً تبحث عن مهارات أساسية، أو خريجاً حديثاً في عالم المهنة، أو معمارياً طموحاً يحتاج دعماً في عروضه، تركز دوراتنا على إتقان فن التواصل البصري في المشهد الرقمي.";

export const URBNIT_PACKS_PROMO_TITLE_EN =
  "Expand your assets library and take your architectural drawings to the next level!";
export const URBNIT_PACKS_PROMO_TITLE_AR =
  "وسّع مكتبة أصولك وارتقِ برسوماتك المعمارية إلى المستوى التالي!";

export const URBNIT_PACKS_PROMO_BODY_EN =
  "Get ready to enhance your drawings and images with our unique and exclusive Packs! Carefully crafted by the urbnit studio team to meet architects' needs.";
export const URBNIT_PACKS_PROMO_BODY_AR =
  "استعد لتعزيز رسوماتك وصورك مع حزمنا الفريدة والحصرية! صُممت بعناية من فريق urbnit studio لتلبية احتياجات المعماريين.";

export const URBNIT_FACEBOOK_PROMO_TITLE_EN = "urbnit studio on Facebook";
export const URBNIT_FACEBOOK_PROMO_TITLE_AR = "urbnit studio على فيسبوك";

export const URBNIT_FACEBOOK_PROMO_BODY_EN =
  "Follow urbnit studio on Facebook for updates, tips, and free content on architectural representation and visualization.";
export const URBNIT_FACEBOOK_PROMO_BODY_AR =
  "تابع urbnit studio على فيسبوك للحصول على التحديثات والنصائح ومحتوى مجاني حول التمثيل والتصور المعماري.";

/** @deprecated use URBNIT_FACEBOOK_* — kept for imports */
export const URBNIT_YOUTUBE_PROMO_TITLE_EN = URBNIT_FACEBOOK_PROMO_TITLE_EN;
export const URBNIT_YOUTUBE_PROMO_TITLE_AR = URBNIT_FACEBOOK_PROMO_TITLE_AR;
export const URBNIT_YOUTUBE_PROMO_BODY_EN = URBNIT_FACEBOOK_PROMO_BODY_EN;
export const URBNIT_YOUTUBE_PROMO_BODY_AR = URBNIT_FACEBOOK_PROMO_BODY_AR;

export const URBNIT_FAQ_TITLE_EN = "Check out our FAQ";
export const URBNIT_FAQ_TITLE_AR = "اطّلع على الأسئلة الشائعة";

export const URBNIT_FAQ_SUBTITLE_EN = "Get answers to the most common questions about our platform.";
export const URBNIT_FAQ_SUBTITLE_AR = "احصل على إجابات لأكثر الأسئلة شيوعاً حول منصتنا.";

export const URBNIT_FOOTER_MISSION_EN =
  "Take your representation and visualization skills to the next level! Learn, create, and grow with our global community of architects and visual artists.";
export const URBNIT_FOOTER_MISSION_AR =
  "ارتقِ بمهارات التمثيل والتصور لديك! تعلّم وأبدع وانمُ مع مجتمعنا العالمي من المعماريين وفناني التصور.";

export const URBNIT_COURSES_PAGE_TITLE_EN = "Courses";
export const URBNIT_COURSES_PAGE_TITLE_AR = "الدورات";

export const URBNIT_COURSES_PAGE_INTRO_EN =
  "Discover our premium courses on representation and visualization for architecture. Whether you're starting from scratch or looking to refine your existing skills, we have you covered!";
export const URBNIT_COURSES_PAGE_INTRO_AR =
  "اكتشف دوراتنا المميزة في التمثيل والتصور المعماري. سواء كنت تبدأ من الصفر أو تريد صقل مهاراتك، نحن معك!";

export const URBNIT_PACKS_PAGE_TITLE_EN = "Packs";
export const URBNIT_PACKS_PAGE_TITLE_AR = "الحزم";

export const URBNIT_PACKS_PAGE_SUBTITLE_EN =
  "Explore this library to find exclusive, custom-made, and high-quality assets.";
export const URBNIT_PACKS_PAGE_SUBTITLE_AR =
  "استكشف هذه المكتبة للعثور على أصول حصرية وعالية الجودة.";

export const URBNIT_PACKS_PAGE_DESCRIPTION_EN =
  "An efficient way to enhance your architectural drawings! All packs were carefully thought out to fit an architect's needs.";
export const URBNIT_PACKS_PAGE_DESCRIPTION_AR =
  "طريقة فعّالة لتعزيز رسوماتك المعمارية! صُممت كل الحزم بعناية لتناسب احتياجات المعماري.";

export const URBNIT_PAGE_TITLE_EN = "urbnit studio | Architectural Representation";
export const URBNIT_PAGE_TITLE_AR = "urbnit studio | التمثيل المعماري";

export const URBNIT_FOOTER_COPYRIGHT_EN = "urbnit studio. All rights reserved.";
export const URBNIT_FOOTER_COPYRIGHT_AR = "urbnit studio. جميع الحقوق محفوظة.";

/** Legacy exports kept for other modules */
export const HOMEPAGE_DEFAULT_REVIEWS_SECTION_TITLE_AR = "ماذا يقول الطلاب";
export const HOMEPAGE_DEFAULT_REVIEWS_SECTION_SUBTITLE_AR = "تجارب حقيقية من طلاب المنصة";
export const HOMEPAGE_DEFAULT_CTA_BADGE_AR = "انطلاقة تعليمية أقوى";
export const HOMEPAGE_DEFAULT_CTA_TITLE_AR = "جاهز تحوّل حلمك لنتيجة حقيقية؟";
export const HOMEPAGE_DEFAULT_CTA_DESCRIPTION_AR =
  "ابدأ الآن بخطوة واثقة: محتوى منظم، شرح واضح، وتمارين عملية تساعدك تثبّت المعلومة بسرعة.";
export const HOMEPAGE_DEFAULT_CTA_BUTTON_AR = "ابدأ رحلتك الآن";
export const HOMEPAGE_DEFAULT_FOOTER_TITLE_AR = URBNIT_PLATFORM_NAME_AR;
export const HOMEPAGE_DEFAULT_FOOTER_TAGLINE_AR = URBNIT_FOOTER_MISSION_AR;
export const HOMEPAGE_DEFAULT_FOOTER_COPYRIGHT_AR = URBNIT_FOOTER_COPYRIGHT_AR;
export const HOMEPAGE_DEFAULT_PLATFORM_NAME_AR = URBNIT_PLATFORM_NAME_AR;
export const HOMEPAGE_DEFAULT_HERO_TITLE_AR = URBNIT_HERO_TITLE_AR;
export const HOMEPAGE_DEFAULT_HERO_SLOGAN_AR = URBNIT_HERO_SLOGAN_AR;
export const HOMEPAGE_DEFAULT_PAGE_TITLE_AR = URBNIT_PAGE_TITLE_AR;
export const HOMEPAGE_DEFAULT_HERO3_TITLE_AR = "المنصة الشاملة رقم 1";
export const HOMEPAGE_DEFAULT_HERO3_SUBTITLE_AR = "انضم لأكثر من مليون طالب مع الخطة";
export const HOMEPAGE_DEFAULT_SOCIAL_RIGHT_LABEL_AR = "الدعم";
export const HOMEPAGE_DEFAULT_SOCIAL_LEFT_LABEL_AR = "دعم الفريق";
export const HOMEPAGE_DEFAULT_STORE_SECTION_TITLE_AR = URBNIT_PACKS_PAGE_TITLE_AR;
export const HOMEPAGE_DEFAULT_STORE_SECTION_DESCRIPTION_AR = URBNIT_PACKS_PAGE_DESCRIPTION_AR;
export const HOMEPAGE_DEFAULT_PLATFORM_DETAILS_TITLE_AR = "“قلم” الحل المثالي!";
export const HOMEPAGE_DEFAULT_PLATFORM_DETAILS_SUBTITLE_AR = "تعرف على أهم ما يميز المنصة";
export const HOMEPAGE_DEFAULT_PLATFORM_NEWS_TITLE_AR = "أخبار المنصة";
