"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AdminIcons } from "@/components/admin/icons";
import { DEMO_CREDENTIALS, isAuthed, login } from "@/lib/admin-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthed()) router.replace("/admin");
  }, [router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !password) {
      setErr("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        login(remember);
        router.push("/admin");
      } else {
        setLoading(false);
        setErr("Invalid credentials. Try the demo login below.");
      }
    }, 650);
  };

  return (
    <ThemeProvider>
      <div className="adm-root">
        <div className="login-wrap">
          <div className="login-aurora" aria-hidden="true">
            <span className="login-blob b1" />
            <span className="login-blob b2" />
            <span className="login-blob b3" />
          </div>

          <form className="login-card" onSubmit={submit}>
            <div className="login-brand">
              <div className="adm-brand-icon" style={{ width: 40, height: 40, fontSize: 15 }}>
                MI
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 16, lineHeight: 1.1 }}>
                  Portfolio <span className="grad-text">CMS</span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-faint)", fontFamily: "var(--font-jetbrains-mono)" }}>
                  admin.muhammedijlan.dev
                </div>
              </div>
            </div>

            <h1 className="login-title">Welcome back</h1>
            <p className="login-sub">Sign in to manage your portfolio content.</p>

            <div className="cms-field" style={{ marginTop: 20 }}>
              <label className="cms-label" htmlFor="email">Email address</label>
              <input
                id="email"
                className="cms-input"
                type="email"
                autoComplete="username"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <div className="cms-field" style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <label className="cms-label" htmlFor="password">Password</label>
                <a href="#" className="login-link" onClick={(e) => e.preventDefault()}>Forgot?</a>
              </div>
              <div className="login-pw">
                <input
                  id="password"
                  className="cms-input"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <AdminIcons.eyeOff style={{ width: 17, height: 17 }} /> : <AdminIcons.eye style={{ width: 17, height: 17 }} />}
                </button>
              </div>
            </div>

            {err && (
              <div className="login-error">
                <AdminIcons.alert style={{ width: 15, height: 15, flexShrink: 0 }} />
                <span>{err}</span>
              </div>
            )}

            <label className="login-remember">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span className="login-check" aria-hidden="true" />
              Keep me signed in
            </label>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  Sign in
                  <AdminIcons.arrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>

            <div className="login-demo">
              <span className="login-demo-label">Demo login</span>
              <div className="login-demo-creds">
                <code>{DEMO_CREDENTIALS.email}</code> · <code>{DEMO_CREDENTIALS.password}</code>
              </div>
              <button
                type="button"
                className="login-demo-fill"
                onClick={() => {
                  setEmail(DEMO_CREDENTIALS.email);
                  setPassword(DEMO_CREDENTIALS.password);
                  setErr("");
                }}
              >
                Fill demo credentials
              </button>
            </div>

            <Link href="/" className="login-back">← Back to portfolio</Link>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
}
