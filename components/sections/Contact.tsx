"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Icons } from "@/components/ui/Icons";
import type { Portfolio } from "@/lib/portfolio-service";

type FormState = { name: string; email: string; subject: string; message: string };
type Errors = Partial<FormState>;
const stripScheme = (url: string) => url.replace(/^https?:\/\//, "");

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Please enter your name";
  if (!f.email.trim()) e.email = "Please enter your email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address";
  if (!f.subject.trim()) e.subject = "Add a subject";
  if (!f.message.trim()) e.message = "Write a short message";
  else if (f.message.trim().length < 10) e.message = "A little more detail, please";
  return e;
}

export function Contact({ contact, index = "05" }: { contact: Portfolio["contact"]; index?: string }) {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [website, setWebsite] = useState("");
  const [serverError, setServerError] = useState("");

  const contactLinks = [
    { glyph: "✉", label: contact.email, href: `mailto:${contact.email}` },
    { glyph: "☎", label: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}` },
    { glyph: "↗", label: stripScheme(contact.socials.github), href: contact.socials.github },
    { glyph: "↗", label: stripScheme(contact.socials.linkedin), href: contact.socials.linkedin },
  ].filter((c) => c.label);

  const onChange = (k: keyof FormState) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...form, [k]: ev.target.value };
    setForm(next);
    if (touched[k]) setErrors(validate(next));
  };

  const onBlur = (k: keyof FormState) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError("");
    const e = validate(form);
    setErrors(e);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(e).length) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        if (json?.extra && typeof json.extra === "object") setErrors(json.extra as Errors);
        setServerError(json?.error || "Couldn't send your message. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setServerError("Network error — please try again.");
      setStatus("idle");
    }
  };

  const reset = () => {
    setStatus("idle");
    setForm({ name: "", email: "", subject: "", message: "" });
    setTouched({});
    setErrors({});
    setServerError("");
  };

  const field = (k: keyof FormState, placeholder: string, type = "text") => (
    <div>
      <input
        id={k}
        aria-label={placeholder}
        type={type}
        className={`field${errors[k] && touched[k] ? " invalid" : ""}`}
        placeholder={placeholder}
        value={form[k]}
        onChange={onChange(k)}
        onBlur={onBlur(k)}
        aria-invalid={!!(errors[k] && touched[k])}
      />
      {errors[k] && touched[k] && <div className="field-err">{errors[k]}</div>}
    </div>
  );

  return (
    <section id="contact" className="section-block" style={{ overflow: "hidden" }}>
      <div className="container-x" style={{ position: "relative" }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute", bottom: "-30%", right: "-10%", width: "44vw", height: "44vw",
            borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%)", pointerEvents: "none",
          }}
        />
        <Reveal>
          <div className="contact-grid" style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "clamp(32px, 5vw, 72px)", alignItems: "start" }}>
            <div>
              <div className="section-label">{index} — Contact</div>
              <h2 className="h2-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.05, marginBottom: 18 }}>
                Let&apos;s build<br />something fast<span style={{ color: "var(--cyan)" }}>.</span>
              </h2>
              <p style={{ margin: "0 0 32px", maxWidth: 440, fontSize: "clamp(15px, 1.8vw, 16.5px)", lineHeight: 1.7, color: "var(--ink-soft)", textWrap: "pretty" }}>
                Open to senior full-stack and Web3 roles, contracts and interesting problems. Drop a line — I reply quickly.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "clamp(12.5px, 1.6vw, 14px)" }}>
                {contactLinks.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="mono-link"
                    style={{ wordBreak: "break-all" }}
                  >
                    <span className="glyph">{c.glyph}</span>{c.label}
                  </a>
                ))}
              </div>
            </div>

            <form className="card-surface" style={{ padding: "clamp(24px, 4vw, 32px)", display: "flex", flexDirection: "column", gap: 14 }} onSubmit={handleSubmit} noValidate>
              {status === "sent" ? (
                <div style={{ textAlign: "center", padding: "2.5rem 1rem" }} role="status" aria-live="polite">
                  <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 1.2rem", display: "grid", placeItems: "center", color: "#ffffff", background: "var(--cyan)", animation: "float-slow 2s ease-in-out infinite" }}>
                    {Icons.check({ width: 30, height: 30 })}
                  </div>
                  <h3 className="font-display" style={{ fontSize: "1.4rem", marginBottom: "0.4rem", fontWeight: 800 }}>Message sent</h3>
                  <p style={{ fontSize: "0.92rem", color: "var(--ink-soft)" }}>Thanks for reaching out — I&apos;ll get back to you shortly.</p>
                  <button type="button" className="btn-pill-ghost" style={{ marginTop: "1.4rem" }} onClick={reset}>
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                  />
                  <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {field("name", "Name")}
                    {field("email", "Email", "email")}
                  </div>
                  {field("subject", "Subject")}
                  <div>
                    <textarea
                      id="message"
                      aria-label="Message"
                      rows={5}
                      className={`field${errors.message && touched.message ? " invalid" : ""}`}
                      placeholder="Message"
                      value={form.message}
                      onChange={onChange("message")}
                      onBlur={onBlur("message")}
                      style={{ resize: "vertical" }}
                    />
                    {errors.message && touched.message && <div className="field-err">{errors.message}</div>}
                  </div>
                  {serverError && (
                    <div className="field-err" role="alert" style={{ textAlign: "center" }}>{serverError}</div>
                  )}
                  <button
                    type="submit"
                    className="btn-pill-accent"
                    style={{ width: "100%", opacity: status === "sending" ? 0.8 : 1 }}
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending…" : "Send message →"}
                  </button>
                  <span style={{ fontSize: 12.5, color: "var(--ink-faint)", textAlign: "center" }}>
                    Your message lands straight in my inbox · I reply quickly
                  </span>
                </>
              )}
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
