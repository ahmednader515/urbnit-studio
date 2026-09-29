import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { listPortfolioProjects } from "@/lib/portfolio";
import { PortfolioList } from "./PortfolioList";

export default async function DashboardPortfolioPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ASSISTANT_ADMIN") redirect("/dashboard");

  const projects = await listPortfolioProjects(false).catch(() => []);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Portfolio</h2>
        <Link
          href="/dashboard/portfolio/new"
          className="rounded-[var(--radius-btn)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]"
        >
          New project
        </Link>
      </div>
      <PortfolioList projects={projects} />
    </div>
  );
}
