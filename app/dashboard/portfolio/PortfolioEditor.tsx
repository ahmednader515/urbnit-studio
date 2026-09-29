"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ImageDraft = {
  imageUrl: string;
  description: string;
  descriptionEn: string;
};

type ProjectDraft = {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  isPublished: boolean;
  images: ImageDraft[];
};

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", "portfolio");
  const res = await fetch("/api/upload/image", { method: "POST", body: fd, credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
  return String(data.url);
}

export function PortfolioEditor({
  projectId,
  initial,
}: {
  projectId?: string;
  initial?: ProjectDraft;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectDraft>(
    initial ?? {
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
      isPublished: true,
      images: [],
    },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function patch(partial: Partial<ProjectDraft>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function patchImage(index: number, partial: Partial<ImageDraft>) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((image, i) => (i === index ? { ...image, ...partial } : image)),
    }));
  }

  async function onUpload(index: number, file: File) {
    setError("");
    try {
      const url = await uploadImage(file);
      patchImage(index, { imageUrl: url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Arabic title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(projectId ? `/api/dashboard/portfolio/${projectId}` : "/api/dashboard/portfolio", {
        method: projectId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          titleEn: form.titleEn,
          description: form.description,
          descriptionEn: form.descriptionEn,
          isPublished: form.isPublished,
          images: form.images,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not save");
      router.push("/dashboard/portfolio");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-3xl space-y-6">
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <label className="block text-sm font-medium">
        Title (Arabic)
        <input
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
          value={form.title}
          onChange={(e) => patch({ title: e.target.value })}
          required
        />
      </label>
      <label className="block text-sm font-medium">
        Title (English)
        <input
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
          value={form.titleEn}
          onChange={(e) => patch({ titleEn: e.target.value })}
        />
      </label>
      <label className="block text-sm font-medium">
        Project description (Arabic)
        <textarea
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
          rows={4}
          value={form.description}
          onChange={(e) => patch({ description: e.target.value })}
        />
      </label>
      <label className="block text-sm font-medium">
        Project description (English)
        <textarea
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
          rows={4}
          value={form.descriptionEn}
          onChange={(e) => patch({ descriptionEn: e.target.value })}
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(e) => patch({ isPublished: e.target.checked })}
        />
        Published
      </label>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Images</h3>
          <button
            type="button"
            className="rounded-[var(--radius-btn)] border border-[var(--color-border)] px-3 py-1.5 text-sm"
            onClick={() =>
              patch({ images: [...form.images, { imageUrl: "", description: "", descriptionEn: "" }] })
            }
          >
            Add image
          </button>
        </div>
        {form.images.map((image, index) => (
          <div key={index} className="rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex flex-wrap items-start gap-4">
              {image.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image.imageUrl} alt="" className="h-24 w-32 rounded-lg object-cover" />
              ) : (
                <div className="flex h-24 w-32 items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-400">
                  No image
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-3">
                <input
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
                  placeholder="Image URL"
                  value={image.imageUrl}
                  onChange={(e) => patchImage(index, { imageUrl: e.target.value })}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onUpload(index, file);
                  }}
                />
                <input
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
                  placeholder="Image description (Arabic)"
                  value={image.description}
                  onChange={(e) => patchImage(index, { description: e.target.value })}
                />
                <input
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
                  placeholder="Image description (English)"
                  value={image.descriptionEn}
                  onChange={(e) => patchImage(index, { descriptionEn: e.target.value })}
                />
              </div>
            </div>
            <button
              type="button"
              className="mt-3 text-sm text-red-600"
              onClick={() => patch({ images: form.images.filter((_, i) => i !== index) })}
            >
              Remove image
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-[var(--radius-btn)] bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save project"}
      </button>
    </form>
  );
}
