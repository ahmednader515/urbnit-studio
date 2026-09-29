import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PortfolioEditor } from "../PortfolioEditor";

export default async function NewPortfolioProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ASSISTANT_ADMIN") redirect("/dashboard");

  return (
    <div>
      <Link href="/dashboard/portfolio" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
        Back to portfolio
      </Link>
      <h2 className="mt-4 text-xl font-bold text-[var(--color-foreground)]">New portfolio project</h2>
      <PortfolioEditor />
    </div>
  );
}
