import { sql } from "@/lib/db";

export type PortfolioImage = {
  id: string;
  imageUrl: string;
  description: string | null;
  descriptionEn: string | null;
  sortOrder: number;
};

export type PortfolioProject = {
  id: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  sortOrder: number;
  isPublished: boolean;
  images: PortfolioImage[];
};

export type PortfolioImageInput = {
  imageUrl: string;
  description?: string | null;
  descriptionEn?: string | null;
};

export type PortfolioProjectInput = {
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  isPublished?: boolean;
  images?: PortfolioImageInput[];
};

function newId(): string {
  const part = () => Math.random().toString(36).slice(2, 10);
  return "c" + part() + part() + Date.now().toString(36).slice(-6);
}

let schemaReady: Promise<void> | null = null;

export function ensurePortfolioSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS "PortfolioProject" (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          title_en TEXT,
          description TEXT,
          description_en TEXT,
          sort_order INT NOT NULL DEFAULT 0,
          is_published BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS "PortfolioImage" (
          id TEXT PRIMARY KEY,
          project_id TEXT NOT NULL REFERENCES "PortfolioProject"(id) ON DELETE CASCADE,
          image_url TEXT NOT NULL,
          description TEXT,
          description_en TEXT,
          sort_order INT NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

function textOrNull(value: unknown): string | null {
  const s = value == null ? "" : String(value).trim();
  return s || null;
}

function mapImage(row: Record<string, unknown>): PortfolioImage {
  return {
    id: String(row.id),
    imageUrl: String(row.image_url ?? ""),
    description: textOrNull(row.description),
    descriptionEn: textOrNull(row.description_en),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

function mapProject(row: Record<string, unknown>, images: PortfolioImage[]): PortfolioProject {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    titleEn: textOrNull(row.title_en),
    description: textOrNull(row.description),
    descriptionEn: textOrNull(row.description_en),
    sortOrder: Number(row.sort_order ?? 0),
    isPublished: Boolean(row.is_published),
    images,
  };
}

async function imagesByProject(projectIds: string[]): Promise<Map<string, PortfolioImage[]>> {
  const grouped = new Map<string, PortfolioImage[]>();
  if (projectIds.length === 0) return grouped;
  const rows = await sql`
    SELECT * FROM "PortfolioImage"
    WHERE project_id = ANY(${projectIds}::text[])
    ORDER BY sort_order ASC, created_at ASC
  `;
  for (const row of rows as Record<string, unknown>[]) {
    const projectId = String(row.project_id);
    const list = grouped.get(projectId) ?? [];
    list.push(mapImage(row));
    grouped.set(projectId, list);
  }
  return grouped;
}

export async function listPortfolioProjects(publishedOnly = false): Promise<PortfolioProject[]> {
  await ensurePortfolioSchema();
  const rows = publishedOnly
    ? await sql`
        SELECT * FROM "PortfolioProject"
        WHERE is_published = true
        ORDER BY sort_order ASC, created_at DESC
      `
    : await sql`
        SELECT * FROM "PortfolioProject"
        ORDER BY sort_order ASC, created_at DESC
      `;
  const projects = rows as Record<string, unknown>[];
  const images = await imagesByProject(projects.map((row) => String(row.id)));
  return projects.map((row) => mapProject(row, images.get(String(row.id)) ?? []));
}

export async function getPortfolioProject(id: string): Promise<PortfolioProject | null> {
  await ensurePortfolioSchema();
  const rows = await sql`SELECT * FROM "PortfolioProject" WHERE id = ${id} LIMIT 1`;
  const row = (rows as Record<string, unknown>[])[0];
  if (!row) return null;
  const images = await imagesByProject([id]);
  return mapProject(row, images.get(id) ?? []);
}

async function replaceImages(projectId: string, images: PortfolioImageInput[]): Promise<void> {
  await sql`DELETE FROM "PortfolioImage" WHERE project_id = ${projectId}`;
  let order = 0;
  for (const image of images) {
    const url = image.imageUrl?.trim();
    if (!url) continue;
    await sql`
      INSERT INTO "PortfolioImage" (id, project_id, image_url, description, description_en, sort_order)
      VALUES (
        ${newId()},
        ${projectId},
        ${url},
        ${textOrNull(image.description)},
        ${textOrNull(image.descriptionEn)},
        ${order}
      )
    `;
    order += 1;
  }
}

export async function createPortfolioProject(input: PortfolioProjectInput): Promise<PortfolioProject> {
  await ensurePortfolioSchema();
  const countRows = await sql`SELECT COUNT(*)::int AS c FROM "PortfolioProject"`;
  const sortOrder = Number((countRows as { c?: number }[])[0]?.c ?? 0);
  const id = newId();
  await sql`
    INSERT INTO "PortfolioProject" (id, title, title_en, description, description_en, sort_order, is_published)
    VALUES (
      ${id},
      ${input.title.trim()},
      ${textOrNull(input.titleEn)},
      ${textOrNull(input.description)},
      ${textOrNull(input.descriptionEn)},
      ${sortOrder},
      ${input.isPublished !== false}
    )
  `;
  await replaceImages(id, input.images ?? []);
  const created = await getPortfolioProject(id);
  if (!created) throw new Error("Could not create portfolio project");
  return created;
}

export async function updatePortfolioProject(id: string, input: PortfolioProjectInput): Promise<PortfolioProject | null> {
  await ensurePortfolioSchema();
  const existing = await getPortfolioProject(id);
  if (!existing) return null;
  await sql`
    UPDATE "PortfolioProject"
    SET title = ${input.title.trim()},
        title_en = ${textOrNull(input.titleEn)},
        description = ${textOrNull(input.description)},
        description_en = ${textOrNull(input.descriptionEn)},
        is_published = ${input.isPublished !== false},
        updated_at = NOW()
    WHERE id = ${id}
  `;
  await replaceImages(id, input.images ?? []);
  return getPortfolioProject(id);
}

export async function deletePortfolioProject(id: string): Promise<void> {
  await ensurePortfolioSchema();
  await sql`DELETE FROM "PortfolioProject" WHERE id = ${id}`;
}
