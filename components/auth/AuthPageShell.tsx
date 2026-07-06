import type { ReactNode } from "react";

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#F5F5F5] px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        {children}
      </div>
    </div>
  );
}

export const authInputClass =
  "mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF]";

export const authLabelClass = "block text-sm font-medium text-neutral-900";

export const authErrorClass = "rounded-md bg-red-50 px-3 py-2 text-sm text-red-600";

export const authLinkClass = "font-medium text-[#0066FF] hover:underline";
