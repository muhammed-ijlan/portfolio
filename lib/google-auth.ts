import { JWT } from "google-auth-library";

type ServiceAccount = { client_email: string; private_key: string };

/**
 * Load a Google service-account key from GOOGLE_SERVICE_ACCOUNT_KEY.
 * Accepts either raw JSON or a base64-encoded JSON blob. Returns null when
 * absent or malformed so callers can degrade gracefully instead of throwing.
 */
export function loadServiceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.trim();
  if (!raw) return null;
  try {
    const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const creds = JSON.parse(json) as Partial<ServiceAccount>;
    if (!creds.client_email || !creds.private_key) return null;
    return { client_email: creds.client_email, private_key: creds.private_key };
  } catch {
    return null;
  }
}

/** Build an authenticated JWT client for the given scopes, or null if unconfigured. */
export function makeJwtClient(scopes: string[]): JWT | null {
  const creds = loadServiceAccount();
  if (!creds) return null;
  return new JWT({ email: creds.client_email, key: creds.private_key, scopes });
}
