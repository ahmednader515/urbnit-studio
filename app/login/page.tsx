"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CONCURRENT_SESSION_ERROR } from "@/lib/auth-constants";
import {
  AuthPageShell,
  authErrorClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from "@/components/auth/AuthPageShell";
import { urbnitBtnPrimary } from "@/components/home/urbnit-styles";
import { useT } from "@/components/LocaleProvider";

function LoginForm() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [concurrentSession, setConcurrentSession] = useState(false);
  const [forceLogoutLoading, setForceLogoutLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const reasonElsewhere = searchParams.get("reason") === "session_ended_elsewhere";
  const signupMessage = searchParams.get("message");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setConcurrentSession(false);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error === CONCURRENT_SESSION_ERROR) {
        setConcurrentSession(true);
        setLoading(false);
        return;
      }
      if (res?.error) {
        setError(t("auth.login.invalidCredentials", "Email/phone or password is incorrect"));
        setLoading(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleForceLogoutOther(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setForceLogoutLoading(true);
    try {
      const r = await fetch("/api/auth/force-logout-other", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(data.error ?? t("auth.login.forceLogoutFailed", "Failed to log out the other device"));
        return;
      }
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError(t("auth.login.loginAfterForceLogoutFailed", "Failed to log in after logging out the other device"));
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setForceLogoutLoading(false);
    }
  }

  if (concurrentSession) {
    return (
      <AuthPageShell>
        <h1 className="text-xl font-bold text-amber-900">
          {t("auth.login.concurrentTitle", "This account is active on another device")}
        </h1>
        <p className="mt-2 text-sm text-amber-800">
          {t(
            "auth.login.concurrentDescription",
            "This account is currently logged in from another device or browser. To continue here, log out the other device first.",
          )}
        </p>
        <p className="mt-3 text-sm text-neutral-600">
          {t(
            "auth.login.concurrentSecurityHint",
            'If you suspect your account was compromised, update your password and account details from "Edit account" after logging in.',
          )}
        </p>
        {error ? <div className={`mt-4 ${authErrorClass}`}>{error}</div> : null}
        <form onSubmit={handleForceLogoutOther} className="mt-6">
          <button type="submit" disabled={forceLogoutLoading} className={`w-full ${urbnitBtnPrimary}`}>
            {forceLogoutLoading
              ? t("auth.login.concurrentActionLoading", "Processing...")
              : t("auth.login.concurrentAction", "Log out the other device and continue here")}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConcurrentSession(false)}
          className="mt-4 w-full text-sm text-neutral-500 hover:text-neutral-800"
        >
          {t("auth.login.concurrentCancel", "Cancel and go back to login")}
        </button>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
      <h1 className="text-2xl font-bold text-neutral-900">{t("auth.login.title", "Log in")}</h1>
      <p className="mt-1 text-sm text-neutral-600">
        {t("auth.login.subtitle", "Enter your details to access your account")}
      </p>
      {signupMessage ? (
        <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {signupMessage}
        </div>
      ) : null}
      {reasonElsewhere ? (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {t(
            "auth.login.sessionEndedElsewhere",
            "You were logged out because this account was opened on another device. Log in again here if you want.",
          )}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error ? <div className={authErrorClass}>{error}</div> : null}
        <div>
          <label htmlFor="email" className={authLabelClass}>
            {t("auth.login.emailOrPhoneLabel", "Email or phone number")}
          </label>
          <input
            id="email"
            type="text"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={authInputClass}
            placeholder={t("auth.login.emailOrPhonePlaceholder", "example@email.com or 01xxxxxxxxx")}
          />
        </div>
        <div>
          <label htmlFor="password" className={authLabelClass}>
            {t("auth.login.passwordLabel", "Password")}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={authInputClass}
          />
          <p className="mt-1.5 text-xs text-neutral-500">
            <Link href="/login/forgot-password" className={authLinkClass}>
              {t("auth.login.forgotPassword", "Forgot password?")}
            </Link>
          </p>
        </div>
        <button type="submit" disabled={loading} className={`w-full ${urbnitBtnPrimary} disabled:opacity-50`}>
          {loading ? t("auth.login.submitting", "Logging in...") : t("auth.login.submit", "Log in")}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        {t("auth.login.noAccount", "Don't have an account?")}{" "}
        <Link href="/register" className={authLinkClass}>
          {t("auth.login.createAccount", "Create account")}
        </Link>
      </p>
    </AuthPageShell>
  );
}

function LoginSkeleton() {
  return (
    <AuthPageShell>
      <div className="h-8 w-40 animate-pulse rounded bg-neutral-200" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-neutral-100" />
      <div className="mt-6 space-y-4">
        <div className="h-10 w-full animate-pulse rounded bg-neutral-100" />
        <div className="h-10 w-full animate-pulse rounded bg-neutral-100" />
        <div className="h-10 w-full animate-pulse rounded bg-neutral-200" />
      </div>
    </AuthPageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
