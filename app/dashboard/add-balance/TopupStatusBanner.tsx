"use client";

type TopupStatusBannerProps = {
  status: TopupStatus;
  labels: {
    successTitle: string;
    successBody: string;
    failedTitle: string;
    failedBody: string;
    pendingTitle: string;
    pendingBody: string;
  };
};

export type TopupStatus = "success" | "failed" | "pending";

export function TopupStatusBanner({ status, labels }: TopupStatusBannerProps) {
  const config =
    status === "success"
      ? { title: labels.successTitle, body: labels.successBody, className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-100" }
      : status === "failed"
        ? { title: labels.failedTitle, body: labels.failedBody, className: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-100" }
        : { title: labels.pendingTitle, body: labels.pendingBody, className: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-100" };

  return (
    <div className={`mt-6 rounded-[var(--radius-btn)] border p-4 ${config.className}`}>
      <p className="font-semibold">{config.title}</p>
      <p className="mt-1 text-sm opacity-90">{config.body}</p>
    </div>
  );
}
