# Fawaterak payment gateway setup

This app uses **Fawaterak iframe checkout** for student balance top-up on `/dashboard/add-balance`.

Balance is credited **only** when Fawaterak sends a paid webhook — not on the success redirect alone.

## Environment variables

Add to `.env` locally and Vercel → Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `FAWATERAK_ENV` | No | `staging` (default) or `live` |
| `FAWATERAK_VENDOR_KEY` | Yes | API Key from Fawaterak dashboard |
| `FAWATERAK_PROVIDER_KEY` | Yes | Provider Key (Integrations page) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public site URL, no trailing slash (e.g. `https://your-app.vercel.app`) |
| `FAWATERAK_IFRAME_DOMAIN` | No | Override iframe domain if different from `NEXT_PUBLIC_APP_URL` |
| `FAWATERAK_API_KEY` | No | Alias for `FAWATERAK_VENDOR_KEY` |

### Staging (testing)

```env
FAWATERAK_ENV=staging
FAWATERAK_VENDOR_KEY=your_staging_api_key
FAWATERAK_PROVIDER_KEY=FAWATERAK.xxxx
NEXT_PUBLIC_APP_URL=https://your-preview-domain.vercel.app
```

Uses:

- Origin: `https://staging.fawaterk.com`
- Plugin: `https://staging.fawaterk.com/fawaterkPlugin/fawaterkPlugin.min.js`
- `envType`: `test`

### Production

```env
FAWATERAK_ENV=live
FAWATERAK_VENDOR_KEY=your_live_api_key
FAWATERAK_PROVIDER_KEY=FAWATERAK.xxxx
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Uses:

- Origin: `https://app.fawaterk.com`
- Plugin: `https://app.fawaterk.com/fawaterkPlugin/fawaterkPlugin.min.js`
- `envType`: `live`

## Fawaterak dashboard

Log in to your Fawaterak account → **Integrations**:

| Field | Value |
|-------|-------|
| IFRAM Domains | `https://your-domain.com` (HTTPS, no trailing slash; add both www and apex if needed) |
| Paid transactions webhook | `https://your-domain.com/api/webhooks/fawaterak_json` |
| Success / Fail redirect URLs | Can point to `/balance-payment-return/success` and `/balance-payment-return/fail` |

Enable payment methods (card, Fawry, wallets) in the dashboard.

## Local development

Fawaterak iframe requires a **registered HTTPS domain**. `http://localhost:3000` will not pass domain validation.

Options:

1. Deploy to Vercel preview and register that URL in Fawaterak IFRAM Domains
2. Use ngrok (or similar) and register the HTTPS tunnel URL

## Verify credentials

After setting env vars:

```powershell
node scripts/verify-fawaterak.mjs
node scripts/verify-fawaterak.mjs https://your-domain.com
```

Or while logged in as any user:

```
GET /api/payments/fawaterak/diagnostics?domain=https://your-domain.com
```

## Flow summary

1. Student enters amount → `POST /api/payments/fawaterak/session`
2. Server creates `FawaterakDeposit` (PENDING) and returns plugin config
3. Browser loads Fawaterak plugin → payment UI in iframe
4. Fawaterak redirects to `/balance-payment-return/*` → dashboard with status banner
5. Fawaterak webhook `POST /api/webhooks/fawaterak_json` credits balance (idempotent)

## Docs

- [Fawaterak staging API](https://staging.fawaterk.com/documentation#description/introduction)
- [Iframe checkout](https://fawaterak-api.readme.io/reference/fawaterk-hosted-checkout)
- [Webhooks](https://fawaterak-api.readme.io/reference/web-hook)
