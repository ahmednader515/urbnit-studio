import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getActivePlatformSubscriptionInfo } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "STUDENT") {
    return NextResponse.json({ active: false, expiresAt: null });
  }

  const { active, expiresAt } = await getActivePlatformSubscriptionInfo(session.user.id);
  return NextResponse.json({
    active,
    expiresAt: expiresAt?.toISOString() ?? null,
  });
}
