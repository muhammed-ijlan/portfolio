// Client-side demo auth for the Portfolio CMS admin panel.
// Suitable for a prototype/showcase — for real protection, wire this up
// to a backend with proper password hashing and session tokens.

const AUTH_KEY = "mi-admin-auth";

export const DEMO_CREDENTIALS = {
  email: "ijlan.dev@gmail.com",
  password: "admin123",
};

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AUTH_KEY) === "1" || sessionStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

export function login(remember: boolean) {
  try {
    (remember ? localStorage : sessionStorage).setItem(AUTH_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function logout() {
  try {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}
