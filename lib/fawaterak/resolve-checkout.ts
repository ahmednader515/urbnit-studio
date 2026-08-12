import { domainCandidates } from "./domain-candidates";
import { browserHostAllowed, normalizeIframeDomain } from "./iframe-domain";
import { validateFawaterakCredentials } from "./validate";
import { getConfiguredIframeDomain, getProviderKey, getVendorKey } from "./config";

export type ResolvedCheckout = {
  iframeDomain: string;
  hashKey: string;
  vendorKey: string;
  providerKey: string;
};

export type ResolveCheckoutError = {
  code: "DOMAIN_MISMATCH" | "VALIDATION_FAILED" | "NOT_CONFIGURED";
  message: string;
  attempts?: Array<{ domain: string; error: string }>;
};

export async function resolveCheckoutContext(clientIframeDomain?: string): Promise<
  | { ok: true; data: ResolvedCheckout }
  | { ok: false; error: ResolveCheckoutError }
> {
  let vendorKey: string;
  let providerKey: string;
  let configuredDomain: string;

  try {
    vendorKey = getVendorKey();
    providerKey = getProviderKey();
    configuredDomain = getConfiguredIframeDomain();
  } catch (err) {
    return {
      ok: false,
      error: {
        code: "NOT_CONFIGURED",
        message: err instanceof Error ? err.message : "Fawaterak not configured",
      },
    };
  }

  const browserDomain = clientIframeDomain
    ? normalizeIframeDomain(clientIframeDomain)
    : configuredDomain;

  if (browserDomain && !browserHostAllowed(browserDomain, configuredDomain)) {
    return {
      ok: false,
      error: {
        code: "DOMAIN_MISMATCH",
        message: `Browser domain ${browserDomain} does not match configured ${configuredDomain}`,
      },
    };
  }

  const seed = browserDomain ?? configuredDomain;
  const candidates = domainCandidates(seed);
  const attempts: Array<{ domain: string; error: string }> = [];

  for (const domain of candidates) {
    const result = await validateFawaterakCredentials(vendorKey, providerKey, domain);
    if (result.ok) {
      return {
        ok: true,
        data: {
          iframeDomain: domain,
          hashKey: result.hashKey,
          vendorKey,
          providerKey,
        },
      };
    }
    attempts.push({ domain, error: result.error });
  }

  return {
    ok: false,
    error: {
      code: "VALIDATION_FAILED",
      message: attempts[0]?.error ?? "Fawaterak credential validation failed",
      attempts,
    },
  };
}
