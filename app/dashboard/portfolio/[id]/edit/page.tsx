import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getPortfolioProject } from "@/lib/portfolio";
import { PortfolioEditor } from "../../PortfolioEditor";

type Props = { params: Promise<{ id: string }> };

export default async function EditPortfolioProjectPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ASSISTANT_ADMIN") redirect("/dashboard");
  const { id } = await params;
  const project = await getPortfolioProject(id).catch(() => null);
  if (!project) notFound();

  return (
    <div>
      <Link href="/dashboard/portfolio" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
        Back to portfolio
      </Link>
      <h2 className="mt-4 text-xl font-bold text-[var(--color-foreground)]">Edit project</h2>
      <PortfolioEditor
        projectId={project.id}
        initial={{
          title: project.title,
          titleEn: project.titleEn ?? "",
          description: project.description ?? "",
          descriptionEn: project.descriptionEn ?? "",
          isPublished: project.isPublished,
          images: project.images.map((image) => ({
            imageUrl: image.imageUrl,
            description: image.description ?? "",
            descriptionEn: image.descriptionEn ?? "",
          })),
        }}
      />
    </div>
  );
}
