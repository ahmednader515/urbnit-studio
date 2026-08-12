"use client";

import { useCallback, useState } from "react";
import type { FawaterakPluginConfig } from "@/types/fawaterak.d";

type SessionResponse = FawaterakPluginConfig & {
  pluginScriptUrl: string;
  depositId?: string;
  error?: string;
  code?: string;
};

type FawaterakBalanceCheckoutProps = {
  labels: {
    amountLabel: string;
    amountPlaceholder: string;
    payButton: string;
    loading: string;
    minMaxHint: string;
    errorGeneric: string;
  };
  minAmount: number;
  maxAmount: number;
  currencyShort: string;
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load payment script"));
    document.body.appendChild(script);
  });
}

export function FawaterakBalanceCheckout({
  labels,
  minAmount,
  maxAmount,
  currencyShort,
}: FawaterakBalanceCheckoutProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutReady, setCheckoutReady] = useState(false);

  const handlePay = useCallback(async () => {
    setError(null);
    const value = Number(amount);
    if (!Number.isFinite(value) || value < minAmount || value > maxAmount) {
      setError(labels.minMaxHint);
      return;
    }

    setLoading(true);
    setCheckoutReady(false);

    try {
      const res = await fetch("/api/payments/fawaterak/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: value,
          iframeDomain: window.location.origin,
        }),
      });

      const data = (await res.json()) as SessionResponse;
      if (!res.ok) {
        setError(data.error || labels.errorGeneric);
        return;
      }

      await loadScript(data.pluginScriptUrl);

      const config: FawaterakPluginConfig = {
        envType: data.envType,
        hashKey: data.hashKey,
        token: data.token,
        style: data.style ?? { listing: "horizontal" },
        version: data.version ?? "0",
        lang: (data.requestBody.lang as string) ?? "ar",
        redirectOutIframe: data.redirectOutIframe ?? true,
        requestBody: data.requestBody,
      };

      if (typeof window.fawaterkCheckout !== "function") {
        setError(labels.errorGeneric);
        return;
      }

      window.fawaterkCheckout(config);
      setCheckoutReady(true);
    } catch {
      setError(labels.errorGeneric);
    } finally {
      setLoading(false);
    }
  }, [amount, labels, maxAmount, minAmount]);

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Fawaterak</h3>
      <p className="mt-1 text-sm text-[var(--color-muted)]">{labels.minMaxHint}</p>

      <div className="mt-4">
        <label className="block text-sm font-medium text-[var(--color-foreground)]">
          {labels.amountLabel}
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            type="number"
            min={minAmount}
            max={maxAmount}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={labels.amountPlaceholder}
            className="w-full max-w-xs rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
            disabled={loading}
          />
          <span className="text-sm text-[var(--color-muted)]">{currencyShort}</span>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handlePay}
        disabled={loading || !amount.trim()}
        className="mt-4 rounded-[var(--radius-btn)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? labels.loading : labels.payButton}
      </button>

      <div
        id="fawaterkDivId"
        className={`mt-6 min-h-[120px] ${checkoutReady ? "" : "hidden"}`}
      />
    </section>
  );
}
