"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { HomepageFaq, HomepageSetting } from "@/lib/types";
import {
  resolveCoursesPromoImages,
  resolveHeroGalleryImages,
  resolveTopBannerImages,
  stringifyImageUrlArray,
  formatWhatsappSupportInput,
} from "@/lib/homepage-urbnit";
import {
  URBNIT_DEFAULT_HEADER_LOGO,
  URBNIT_HERO_TEACHER_IMAGE_1,
  URBNIT_HERO_TEACHER_IMAGE_2,
  URBNIT_WHATSAPP_SUPPORT_NUMBER,
  URBNIT_WHATSAPP_SUPPORT_URL,
} from "@/lib/homepage-known-defaults";
import { useT } from "@/components/LocaleProvider";

function BilingualField({
  label,
  valueAr,
  valueEn,
  onChangeAr,
  onChangeEn,
  multiline,
}: {
  label: string;
  valueAr: string;
  valueEn: string;
  onChangeAr: (v: string) => void;
  onChangeEn: (v: string) => void;
  multiline?: boolean;
}) {
  const Input = multiline ? "textarea" : "input";
  return (
    <div className="space-y-2 rounded-lg border border-[var(--color-border)] p-4">
      <p className="text-sm font-semibold text-[var(--color-foreground)]">{label}</p>
      <label className="block text-xs text-[var(--color-muted)]">العربية</label>
      <Input
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
        value={valueAr}
        onChange={(e) => onChangeAr(e.target.value)}
        rows={multiline ? 4 : undefined}
      />
      <label className="block text-xs text-[var(--color-muted)]">English</label>
      <Input
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
        value={valueEn}
        onChange={(e) => onChangeEn(e.target.value)}
        rows={multiline ? 4 : undefined}
      />
    </div>
  );
}

async function uploadImage(file: File, folder = "homepage"): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/upload/image", { method: "POST", body: fd, credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  if (!data.url) throw new Error(data.error ?? "Upload succeeded but no URL returned");
  return String(data.url);
}

function ImageUrlField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--color-foreground)]">{label}</p>
      {hint ? <p className="text-xs text-[var(--color-muted)]">{hint}</p> : null}
      {value ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-16 w-16 rounded-lg border object-cover" />
          <button
            type="button"
            className="text-xs text-red-600 hover:underline"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        </div>
      ) : null}
      <input
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
        value={value}
        onChange={(e) => {
          setUploadError("");
          onChange(e.target.value);
        }}
        placeholder="https://..."
      />
      <label className="inline-flex cursor-pointer items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium hover:bg-[var(--color-border)]/30">
        <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={onPickFile} />
        {uploading ? "Uploading to Cloudflare…" : "Upload image"}
      </label>
      {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
    </div>
  );
}

function ImageMultiUpload({
  label,
  images,
  onChange,
  max,
  hint,
}: {
  label: string;
  images: string[];
  onChange: (urls: string[]) => void;
  max: number;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    e.target.value = "";
    if (!files?.length) return;
    setUploading(true);
    setUploadError("");
    try {
      const slotsLeft = Math.max(0, max - images.length);
      const urls: string[] = [];
      for (const file of Array.from(files).slice(0, slotsLeft)) {
        urls.push(await uploadImage(file));
      }
      onChange([...images, ...urls].slice(0, max));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--color-foreground)]">{label}</p>
      {hint ? <p className="text-xs text-[var(--color-muted)]">{hint}</p> : null}
      <label className="inline-flex cursor-pointer items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium hover:bg-[var(--color-border)]/30">
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={uploading || images.length >= max}
          onChange={onPickFiles}
        />
        {uploading
          ? "Uploading to Cloudflare…"
          : `Upload image${max > 1 ? "s" : ""} (${images.length}/${max})`}
      </label>
      {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
      {images.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="relative h-16 w-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full rounded object-cover" />
              <button
                type="button"
                className="absolute -end-1 -top-1 rounded-full bg-red-500 px-1 text-xs text-white"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function UrbnitHomepageSettingsForm({ initialSettings }: { initialSettings: HomepageSetting }) {
  const router = useRouter();
  const t = useT();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [s, setS] = useState(initialSettings);
  const [faqs, setFaqs] = useState<HomepageFaq[]>([]);
  const [gallery, setGallery] = useState<string[]>(
    resolveHeroGalleryImages(initialSettings.heroGalleryImages),
  );
  const [banner, setBanner] = useState<string[]>(resolveTopBannerImages(initialSettings.topBannerImages));
  const [coursesImages, setCoursesImages] = useState<string[]>(
    resolveCoursesPromoImages(initialSettings.coursesPromoImages, 4),
  );

  useEffect(() => {
    fetch("/api/dashboard/homepage-faqs")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setFaqs(data))
      .catch(() => {});
  }, []);

  function patch<K extends keyof HomepageSetting>(key: K, value: HomepageSetting[K]) {
    setS((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/settings/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroTemplate: "urbnit",
          platformName: s.platformName,
          platformNameEn: s.platformNameEn,
          headerLogoUrl: s.headerLogoUrl,
          primaryColor: s.primaryColor,
          pageTitle: s.pageTitle,
          pageTitleEn: s.pageTitleEn,
          heroTitle: s.heroTitle,
          heroTitleEn: s.heroTitleEn,
          heroSlogan: s.heroSlogan,
          heroSloganEn: s.heroSloganEn,
          heroGalleryImages: stringifyImageUrlArray(gallery),
          heroCtaPrimaryText: s.heroCtaPrimaryText,
          heroCtaPrimaryTextEn: s.heroCtaPrimaryTextEn,
          heroCtaPrimaryHref: s.heroCtaPrimaryHref,
          heroCtaSecondaryText: s.heroCtaSecondaryText,
          heroCtaSecondaryTextEn: s.heroCtaSecondaryTextEn,
          heroCtaSecondaryHref: s.heroCtaSecondaryHref,
          heroFloatImage1: s.heroFloatImage1,
          heroFloatImage2: s.heroFloatImage2,
          topBannerImages: stringifyImageUrlArray(banner),
          coursesPromoImages: stringifyImageUrlArray(coursesImages, 4),
          coursesPromoTitle: s.coursesPromoTitle,
          coursesPromoTitleEn: s.coursesPromoTitleEn,
          coursesPromoBody: s.coursesPromoBody,
          coursesPromoBodyEn: s.coursesPromoBodyEn,
          coursesPromoCtaText: s.coursesPromoCtaText,
          coursesPromoCtaTextEn: s.coursesPromoCtaTextEn,
          coursesPromoCtaHref: s.coursesPromoCtaHref,
          packsPromoImageUrl: s.packsPromoImageUrl,
          packsPromoTitle: s.packsPromoTitle,
          packsPromoTitleEn: s.packsPromoTitleEn,
          packsPromoBody: s.packsPromoBody,
          packsPromoBodyEn: s.packsPromoBodyEn,
          packsPromoCtaText: s.packsPromoCtaText,
          packsPromoCtaTextEn: s.packsPromoCtaTextEn,
          packsPromoCtaHref: s.packsPromoCtaHref,
          youtubePromoImageUrl: s.youtubePromoImageUrl,
          youtubePromoTitle: s.youtubePromoTitle,
          youtubePromoTitleEn: s.youtubePromoTitleEn,
          youtubePromoBody: s.youtubePromoBody,
          youtubePromoBodyEn: s.youtubePromoBodyEn,
          youtubePromoCtaText: s.youtubePromoCtaText,
          youtubePromoCtaTextEn: s.youtubePromoCtaTextEn,
          facebookUrl: s.facebookUrl,
          whatsappUrl: s.whatsappUrl,
          instagramUrl: s.instagramUrl,
          pinterestUrl: s.pinterestUrl,
          faqTitle: s.faqTitle,
          faqTitleEn: s.faqTitleEn,
          faqSubtitle: s.faqSubtitle,
          faqSubtitleEn: s.faqSubtitleEn,
          footerMission: s.footerMission,
          footerMissionEn: s.footerMissionEn,
          footerCopyright: s.footerCopyright,
          footerCopyrightEn: s.footerCopyrightEn,
          coursesPageTitle: s.coursesPageTitle,
          coursesPageTitleEn: s.coursesPageTitleEn,
          coursesPageIntro: s.coursesPageIntro,
          coursesPageIntroEn: s.coursesPageIntroEn,
          packsPageTitle: s.packsPageTitle,
          packsPageTitleEn: s.packsPageTitleEn,
          packsPageSubtitle: s.packsPageSubtitle,
          packsPageSubtitleEn: s.packsPageSubtitleEn,
          packsPageDescription: s.packsPageDescription,
          packsPageDescriptionEn: s.packsPageDescriptionEn,
          aboutTitle: s.aboutTitle,
          aboutTitleEn: s.aboutTitleEn,
          aboutBody: s.aboutBody,
          aboutBodyEn: s.aboutBodyEn,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function addFaq() {
    const res = await fetch("/api/dashboard/homepage-faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: "سؤال جديد",
        questionEn: "New question",
        answer: "إجابة",
        answerEn: "Answer",
        sortOrder: faqs.length,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setFaqs((prev) => [
        ...prev,
        {
          id: data.id,
          question: "سؤال جديد",
          questionEn: "New question",
          answer: "إجابة",
          answerEn: "Answer",
          sortOrder: prev.length,
        },
      ]);
    }
  }

  async function saveFaq(faq: HomepageFaq) {
    await fetch(`/api/dashboard/homepage-faqs/${faq.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: faq.question,
        questionEn: faq.questionEn,
        answer: faq.answer,
        answerEn: faq.answerEn,
        sortOrder: faq.sortOrder,
      }),
    });
  }

  async function removeFaq(id: string) {
    await fetch(`/api/dashboard/homepage-faqs/${id}`, { method: "DELETE" });
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="mt-8 space-y-8">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Brand & header</h3>
        <BilingualField
          label="Platform name"
          valueAr={s.platformName ?? ""}
          valueEn={s.platformNameEn ?? ""}
          onChangeAr={(v) => patch("platformName", v)}
          onChangeEn={(v) => patch("platformNameEn", v)}
        />
        <ImageUrlField
          label="Logo"
          hint={`Upload to Cloudflare R2 or paste a URL. Leave empty to use the built-in default (${URBNIT_DEFAULT_HEADER_LOGO}).`}
          value={s.headerLogoUrl ?? ""}
          onChange={(v) => patch("headerLogoUrl", v || null)}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Hero</h3>
        <BilingualField
          label="Hero title"
          valueAr={s.heroTitle ?? ""}
          valueEn={s.heroTitleEn ?? ""}
          onChangeAr={(v) => patch("heroTitle", v)}
          onChangeEn={(v) => patch("heroTitleEn", v)}
        />
        <BilingualField
          label="Hero subtitle"
          valueAr={s.heroSlogan ?? ""}
          valueEn={s.heroSloganEn ?? ""}
          onChangeAr={(v) => patch("heroSlogan", v)}
          onChangeEn={(v) => patch("heroSloganEn", v)}
          multiline
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <BilingualField
            label="Primary CTA text"
            valueAr={s.heroCtaPrimaryText ?? ""}
            valueEn={s.heroCtaPrimaryTextEn ?? ""}
            onChangeAr={(v) => patch("heroCtaPrimaryText", v)}
            onChangeEn={(v) => patch("heroCtaPrimaryTextEn", v)}
          />
          <label className="block text-sm">
            Primary CTA link
            <input
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
              value={s.heroCtaPrimaryHref ?? ""}
              onChange={(e) => patch("heroCtaPrimaryHref", e.target.value)}
            />
          </label>
          <BilingualField
            label="Secondary CTA text"
            valueAr={s.heroCtaSecondaryText ?? ""}
            valueEn={s.heroCtaSecondaryTextEn ?? ""}
            onChangeAr={(v) => patch("heroCtaSecondaryText", v)}
            onChangeEn={(v) => patch("heroCtaSecondaryTextEn", v)}
          />
          <label className="block text-sm">
            Secondary CTA link
            <input
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
              value={s.heroCtaSecondaryHref ?? ""}
              onChange={(e) => patch("heroCtaSecondaryHref", e.target.value)}
            />
          </label>
        </div>
        <ImageMultiUpload
          label="Gallery images"
          hint="Up to 20 images used as decorative hero background. Stored on Cloudflare R2."
          images={gallery}
          onChange={setGallery}
          max={20}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUrlField
            label="Hero teacher image (front)"
            hint={`Stacked portrait on the right. Default: ${URBNIT_HERO_TEACHER_IMAGE_1}`}
            value={s.heroFloatImage1 ?? ""}
            onChange={(v) => patch("heroFloatImage1", v || null)}
          />
          <ImageUrlField
            label="Hero teacher image (back)"
            hint={`Stacked portrait on the right. Default: ${URBNIT_HERO_TEACHER_IMAGE_2}`}
            value={s.heroFloatImage2 ?? ""}
            onChange={(v) => patch("heroFloatImage2", v || null)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Top banner</h3>
        <ImageMultiUpload
          label="Banner strip images"
          hint="Optional row above the hero. Up to 12 images."
          images={banner}
          onChange={setBanner}
          max={12}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Courses promo</h3>
        <BilingualField
          label="Title"
          valueAr={s.coursesPromoTitle ?? ""}
          valueEn={s.coursesPromoTitleEn ?? ""}
          onChangeAr={(v) => patch("coursesPromoTitle", v)}
          onChangeEn={(v) => patch("coursesPromoTitleEn", v)}
        />
        <BilingualField
          label="Body"
          valueAr={s.coursesPromoBody ?? ""}
          valueEn={s.coursesPromoBodyEn ?? ""}
          onChangeAr={(v) => patch("coursesPromoBody", v)}
          onChangeEn={(v) => patch("coursesPromoBodyEn", v)}
          multiline
        />
        <ImageMultiUpload
          label="Promo images"
          hint="4 images for the courses section grid."
          images={coursesImages}
          onChange={setCoursesImages}
          max={4}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Packs promo</h3>
        <BilingualField
          label="Title"
          valueAr={s.packsPromoTitle ?? ""}
          valueEn={s.packsPromoTitleEn ?? ""}
          onChangeAr={(v) => patch("packsPromoTitle", v)}
          onChangeEn={(v) => patch("packsPromoTitleEn", v)}
        />
        <BilingualField
          label="Body"
          valueAr={s.packsPromoBody ?? ""}
          valueEn={s.packsPromoBodyEn ?? ""}
          onChangeAr={(v) => patch("packsPromoBody", v)}
          onChangeEn={(v) => patch("packsPromoBodyEn", v)}
          multiline
        />
        <ImageUrlField
          label="Feature image"
          value={s.packsPromoImageUrl ?? ""}
          onChange={(v) => patch("packsPromoImageUrl", v || null)}
        />
      </section>

      <section className="space-y-4 rounded-xl border-2 border-[#25D366]/30 bg-[#25D366]/5 p-5">
        <div>
          <h3 className="text-lg font-bold">Support — WhatsApp</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Phone number for the floating WhatsApp button on the homepage (bottom-right corner).
          </p>
        </div>
        <label className="block text-sm font-medium text-[var(--color-foreground)]">
          Support phone number
          <input
            type="tel"
            className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm"
            value={formatWhatsappSupportInput(s.whatsappUrl) || s.whatsappUrl || ""}
            onChange={(e) => patch("whatsappUrl", e.target.value || null)}
            placeholder={URBNIT_WHATSAPP_SUPPORT_NUMBER}
          />
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Example: {URBNIT_WHATSAPP_SUPPORT_NUMBER}. You can also paste a full link like{" "}
            {URBNIT_WHATSAPP_SUPPORT_URL}. Leave empty to use the default number.
          </p>
        </label>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Facebook promo</h3>
        <BilingualField
          label="Title"
          valueAr={s.youtubePromoTitle ?? ""}
          valueEn={s.youtubePromoTitleEn ?? ""}
          onChangeAr={(v) => patch("youtubePromoTitle", v)}
          onChangeEn={(v) => patch("youtubePromoTitleEn", v)}
        />
        <BilingualField
          label="Body"
          valueAr={s.youtubePromoBody ?? ""}
          valueEn={s.youtubePromoBodyEn ?? ""}
          onChangeAr={(v) => patch("youtubePromoBody", v)}
          onChangeEn={(v) => patch("youtubePromoBodyEn", v)}
          multiline
        />
        <BilingualField
          label="CTA text"
          valueAr={s.youtubePromoCtaText ?? ""}
          valueEn={s.youtubePromoCtaTextEn ?? ""}
          onChangeAr={(v) => patch("youtubePromoCtaText", v)}
          onChangeEn={(v) => patch("youtubePromoCtaTextEn", v)}
        />
        <ImageUrlField
          label="Promo image"
          value={s.youtubePromoImageUrl ?? ""}
          onChange={(v) => patch("youtubePromoImageUrl", v || null)}
        />
        <label className="block text-sm">
          Facebook URL
          <input
            className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
            value={s.facebookUrl ?? ""}
            onChange={(e) => patch("facebookUrl", e.target.value)}
          />
        </label>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">FAQ</h3>
        <BilingualField
          label="FAQ section title"
          valueAr={s.faqTitle ?? ""}
          valueEn={s.faqTitleEn ?? ""}
          onChangeAr={(v) => patch("faqTitle", v)}
          onChangeEn={(v) => patch("faqTitleEn", v)}
        />
        {faqs.map((faq, i) => (
          <div key={faq.id} className="space-y-2 rounded-lg border border-[var(--color-border)] p-4">
            <input
              className="w-full rounded border px-2 py-1 text-sm"
              value={faq.question}
              placeholder="Question AR"
              onChange={(e) =>
                setFaqs((prev) => prev.map((f, j) => (j === i ? { ...f, question: e.target.value } : f)))
              }
              onBlur={() => saveFaq(faqs[i])}
            />
            <input
              className="w-full rounded border px-2 py-1 text-sm"
              value={faq.questionEn ?? ""}
              placeholder="Question EN"
              onChange={(e) =>
                setFaqs((prev) => prev.map((f, j) => (j === i ? { ...f, questionEn: e.target.value } : f)))
              }
              onBlur={() => saveFaq(faqs[i])}
            />
            <textarea
              className="w-full rounded border px-2 py-1 text-sm"
              value={faq.answer}
              placeholder="Answer AR"
              rows={2}
              onChange={(e) =>
                setFaqs((prev) => prev.map((f, j) => (j === i ? { ...f, answer: e.target.value } : f)))
              }
              onBlur={() => saveFaq(faqs[i])}
            />
            <textarea
              className="w-full rounded border px-2 py-1 text-sm"
              value={faq.answerEn ?? ""}
              placeholder="Answer EN"
              rows={2}
              onChange={(e) =>
                setFaqs((prev) => prev.map((f, j) => (j === i ? { ...f, answerEn: e.target.value } : f)))
              }
              onBlur={() => saveFaq(faqs[i])}
            />
            <button type="button" className="text-sm text-red-600" onClick={() => removeFaq(faq.id)}>
              Delete
            </button>
          </div>
        ))}
        <button type="button" className="text-sm text-[#0066FF]" onClick={addFaq}>
          + Add FAQ item
        </button>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Footer</h3>
        <BilingualField
          label="Mission"
          valueAr={s.footerMission ?? ""}
          valueEn={s.footerMissionEn ?? ""}
          onChangeAr={(v) => patch("footerMission", v)}
          onChangeEn={(v) => patch("footerMissionEn", v)}
          multiline
        />
        <BilingualField
          label="Copyright"
          valueAr={s.footerCopyright ?? ""}
          valueEn={s.footerCopyrightEn ?? ""}
          onChangeAr={(v) => patch("footerCopyright", v)}
          onChangeEn={(v) => patch("footerCopyrightEn", v)}
        />
        <label className="block text-sm">
          Instagram URL
          <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={s.instagramUrl ?? ""} onChange={(e) => patch("instagramUrl", e.target.value)} />
        </label>
        <label className="block text-sm">
          Pinterest URL
          <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={s.pinterestUrl ?? ""} onChange={(e) => patch("pinterestUrl", e.target.value)} />
        </label>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Courses page</h3>
        <BilingualField
          label="Page title"
          valueAr={s.coursesPageTitle ?? ""}
          valueEn={s.coursesPageTitleEn ?? ""}
          onChangeAr={(v) => patch("coursesPageTitle", v)}
          onChangeEn={(v) => patch("coursesPageTitleEn", v)}
        />
        <BilingualField
          label="Intro"
          valueAr={s.coursesPageIntro ?? ""}
          valueEn={s.coursesPageIntroEn ?? ""}
          onChangeAr={(v) => patch("coursesPageIntro", v)}
          onChangeEn={(v) => patch("coursesPageIntroEn", v)}
          multiline
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Packs page</h3>
        <BilingualField
          label="Page title"
          valueAr={s.packsPageTitle ?? ""}
          valueEn={s.packsPageTitleEn ?? ""}
          onChangeAr={(v) => patch("packsPageTitle", v)}
          onChangeEn={(v) => patch("packsPageTitleEn", v)}
        />
        <BilingualField
          label="Subtitle"
          valueAr={s.packsPageSubtitle ?? ""}
          valueEn={s.packsPageSubtitleEn ?? ""}
          onChangeAr={(v) => patch("packsPageSubtitle", v)}
          onChangeEn={(v) => patch("packsPageSubtitleEn", v)}
        />
        <BilingualField
          label="Description"
          valueAr={s.packsPageDescription ?? ""}
          valueEn={s.packsPageDescriptionEn ?? ""}
          onChangeAr={(v) => patch("packsPageDescription", v)}
          onChangeEn={(v) => patch("packsPageDescriptionEn", v)}
          multiline
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">About page</h3>
        <BilingualField
          label="Title"
          valueAr={s.aboutTitle ?? ""}
          valueEn={s.aboutTitleEn ?? ""}
          onChangeAr={(v) => patch("aboutTitle", v)}
          onChangeEn={(v) => patch("aboutTitleEn", v)}
        />
        <BilingualField
          label="Body"
          valueAr={s.aboutBody ?? ""}
          valueEn={s.aboutBodyEn ?? ""}
          onChangeAr={(v) => patch("aboutBody", v)}
          onChangeEn={(v) => patch("aboutBodyEn", v)}
          multiline
        />
      </section>

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="rounded-lg bg-[#0066FF] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? t("common.saving", "Saving...") : t("common.save", "Save")}
      </button>
    </div>
  );
}
