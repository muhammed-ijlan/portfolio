import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import { AdminUser } from "./models/AdminUser";

const scryptAsync = promisify(scrypt);

export const SESSION_COOKIE = "mi-admin-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

/* ---------- Password hashing (scrypt, no native deps) ---------- */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const keyBuf = Buffer.from(key, "hex");
  return keyBuf.length === derived.length && timingSafeEqual(keyBuf, derived);
}

/* ---------- Session tokens (compact HMAC-signed, JWT-like) ---------- */
export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
  exp: number; // epoch ms
};

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 8) {
    throw new Error("AUTH_SECRET is not set (use a long random string).");
  }
  return s;
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function signSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySession(token: string): SessionPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/* ---------- Cookie helpers ---------- */
export async function startSession(user: {
  id: string;
  email: string;
  name: string;
  role: string;
}) {
  const token = signSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/* ---------- Guard ---------- */
export class AuthError extends Error {
  status = 401;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

// Throw inside a route handler; handleError() maps AuthError → 401.
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new AuthError();
  return session;
}

/* ---------- Default admin bootstrap ---------- */
// Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD (falling back to the
// prototype demo creds) when no admin exists yet, so the first login works.
export async function ensureDefaultAdmin() {
  await connectDB();
  const count = await AdminUser.countDocuments();
  if (count > 0) return null;
  const email = (process.env.ADMIN_EMAIL || "ijlan.dev@gmail.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const user = await AdminUser.create({
    email,
    name: "Muhammed Ijlan",
    role: "owner",
    passwordHash: await hashPassword(password),
  });
  return user;
}
