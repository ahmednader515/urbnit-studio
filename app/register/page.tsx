"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthPageShell,
  authErrorClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from "@/components/auth/AuthPageShell";
import { urbnitBtnPrimary } from "@/components/home/urbnit-styles";
import { useT } from "@/components/LocaleProvider";

export default function RegisterPage() {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const digits = studentNumber.replace(/\D/g, "");
    if (digits.length !== 11) {
      setError(t("auth.register.phoneMustBe11", "Phone number must be 11 digits"));
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name,
        student_number: studentNumber.trim() || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? t("auth.register.createFailed", "Failed to create account"));
      return;
    }
    router.push(
      `/login?message=${encodeURIComponent(t("auth.register.signupSuccessMessage", "Account created successfully, you can now log in"))}`,
    );
    router.refresh();
  }

  return (
    <AuthPageShell>
      <h1 className="text-2xl font-bold text-neutral-900">{t("auth.register.title", "Create account")}</h1>
      <p className="mt-1 text-sm text-neutral-600">
        {t("auth.register.subtitle", "Register as a student to access courses and learn")}
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error ? <div className={authErrorClass}>{error}</div> : null}
        <div>
          <label htmlFor="name" className={authLabelClass}>
            {t("auth.register.nameLabel", "Name")}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className={authInputClass}
            placeholder={t("auth.register.namePlaceholder", "Ahmed Mohamed")}
          />
        </div>
        <div>
          <label htmlFor="email" className={authLabelClass}>
            {t("auth.register.emailLabel", "Email")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={authInputClass}
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label htmlFor="student_number" className={authLabelClass}>
            {t("auth.register.phoneLabel", "Phone number")}
          </label>
          <input
            id="student_number"
            type="tel"
            inputMode="numeric"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required
            className={`${authInputClass} text-end`}
            placeholder="01234567890"
          />
        </div>
        <div>
          <label htmlFor="password" className={authLabelClass}>
            {t("auth.register.passwordLabel", "Password")}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={authInputClass}
            placeholder={t("auth.register.passwordPlaceholder", "At least 6 characters")}
          />
        </div>
        <button type="submit" disabled={loading} className={`w-full ${urbnitBtnPrimary} disabled:opacity-50`}>
          {loading ? t("auth.register.submitting", "Creating account...") : t("auth.register.submit", "Create account")}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        {t("auth.register.hasAccount", "Already have an account?")}{" "}
        <Link href="/login" className={authLinkClass}>
          {t("auth.register.login", "Log in")}
        </Link>
      </p>
    </AuthPageShell>
  );
}
