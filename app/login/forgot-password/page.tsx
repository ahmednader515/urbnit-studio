"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AuthPageShell,
  authErrorClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from "@/components/auth/AuthPageShell";
import { urbnitBtnPrimary } from "@/components/home/urbnit-styles";
import { useT } from "@/components/LocaleProvider";

export default function ForgotPasswordPage() {
  const t = useT();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-password-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrPhone: emailOrPhone.trim(),
          oldPassword: oldPassword || undefined,
          newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? t("auth.forgot.sendFailed", "Failed to send request"));
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError(t("auth.forgot.connectionError", "Connection error occurred"));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthPageShell>
        <h1 className="text-2xl font-bold text-neutral-900">{t("auth.forgot.sentTitle", "Request sent")}</h1>
        <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {t(
            "auth.forgot.sentDescription",
            "Your password-change request has been sent to admin. Your data will be updated within hours. Thanks for your patience.",
          )}
        </div>
        <Link href="/login" className={`mt-6 block w-full text-center ${urbnitBtnPrimary}`}>
          {t("auth.forgot.backToLogin", "Back to login")}
        </Link>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
      <h1 className="text-2xl font-bold text-neutral-900">
        {t("auth.forgot.title", "Forgot password / Request account update")}
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        {t(
          "auth.forgot.subtitle",
          "Enter your registered email or phone and your new password. The request will be sent to admin and handled within hours.",
        )}
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error ? <div className={authErrorClass}>{error}</div> : null}
        <div>
          <label htmlFor="emailOrPhone" className={authLabelClass}>
            {t("auth.forgot.emailOrPhoneLabel", "Email or phone number")}
          </label>
          <input
            id="emailOrPhone"
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
            className={authInputClass}
            placeholder={t("auth.forgot.emailOrPhonePlaceholder", "example@email.com or 01xxxxxxxxx")}
          />
        </div>
        <div>
          <label htmlFor="oldPassword" className={authLabelClass}>
            {t("auth.forgot.oldPasswordLabel", "Current password (optional if remembered)")}
          </label>
          <input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={authInputClass}
            placeholder={t("auth.forgot.oldPasswordPlaceholder", "Shown to admin if provided")}
          />
        </div>
        <div>
          <label htmlFor="newPassword" className={authLabelClass}>
            {t("auth.forgot.newPasswordLabel", "New password")}
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className={authInputClass}
            placeholder={t("auth.forgot.newPasswordPlaceholder", "At least 6 characters")}
          />
        </div>
        <button type="submit" disabled={loading} className={`w-full ${urbnitBtnPrimary} disabled:opacity-50`}>
          {loading ? t("auth.forgot.submitting", "Sending...") : t("auth.forgot.submit", "Send request")}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        <Link href="/login" className={authLinkClass}>
          ← {t("auth.forgot.backToLogin", "Back to login")}
        </Link>
      </p>
    </AuthPageShell>
  );
}
