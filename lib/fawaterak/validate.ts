import { getFawaterakValidateUrl } from "./config";
import { computeIframeHashKey } from "./hmac";

export type ValidateResult =
  | { ok: true; domain: string; hashKey: string }
  | { ok: false; domain: string; error: string; status?: number };

export async function validateFawaterakCredentials(
  vendorKey: string,
  providerKey: string,
  domain: string,
): Promise<ValidateResult> {
  const hashKey = computeIframeHashKey(vendorKey, domain, providerKey);
  const url = getFawaterakValidateUrl();

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${vendorKey}`,
        "FAWATERAK-HASH-KEY": hashKey,
        "FAWATERAK-DOMAIN": domain,
        "DOMAIN-VERSION": "0",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      let detail = "";
      try {
        const body = (await res.json()) as { message?: string };
        detail = body.message ?? "";
      } catch {
        /* ignore */
      }
      return {
        ok: false,
        domain,
        status: res.status,
        error: detail || `Fawaterak validate failed (${res.status})`,
      };
    }

    return { ok: true, domain, hashKey };
  } catch (err) {
    return {
      ok: false,
      domain,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}
