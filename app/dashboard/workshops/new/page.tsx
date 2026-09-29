import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getServerTranslator } from "@/lib/i18n/server";
import { CreateCourseForm } from "../../courses/new/CreateCourseForm";

export default async function NewWorkshopPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "ASSISTANT_ADMIN") redirect("/dashboard");
  const t = await getServerTranslator();

  return (
    <div>
      <Link href="/dashboard/workshops" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
        {t("dashboardNav.workshops", "Workshops")}
      </Link>
      <h2 className="mt-4 text-xl font-bold text-[var(--color-foreground)]">
        {t("dashboardNav.createWorkshop", "Create workshop")}
      </h2>
      <CreateCourseForm kind="workshop" redirectTo="/dashboard/workshops" />
    </div>
  );
}
