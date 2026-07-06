"use client";

import dynamic from "next/dynamic";

const InspectGuard = dynamic(
  () => import("@/components/InspectGuard").then((m) => ({ default: m.InspectGuard })),
  { ssr: false },
);

export function InspectGuardLazy() {
  return <InspectGuard />;
}
