"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PortfolioProject } from "@/lib/portfolio";

export function PortfolioList({ projects }: { projects: PortfolioProject[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dashboard/portfolio/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Could not delete");
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (projects.length === 0) {
    return <p className="text-sm text-[var(--color-muted)]">No portfolio projects yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--color-border)]/30 text-start">
          <tr>
            <th className="px-4 py-3 text-start font-medium">Project</th>
            <th className="px-4 py-3 text-start font-medium">Images</th>
            <th className="px-4 py-3 text-start font-medium">Status</th>
            <th className="px-4 py-3 text-start font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-t border-[var(--color-border)]">
              <td className="px-4 py-3">
                <div className="font-medium">{project.title}</div>
                {project.titleEn ? <div className="text-xs text-[var(--color-muted)]">{project.titleEn}</div> : null}
              </td>
              <td className="px-4 py-3">{project.images.length}</td>
              <td className="px-4 py-3">{project.isPublished ? "Published" : "Hidden"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <Link href={`/dashboard/portfolio/${project.id}/edit`} className="text-[var(--color-primary)] hover:underline">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="text-red-600 disabled:opacity-50"
                    disabled={deletingId === project.id}
                    onClick={() => void remove(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
