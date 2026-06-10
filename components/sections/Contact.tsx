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

export function Contact({ contact }: { contact: Portfolio["contact"] }) {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [website, setWebsite] = useState(""); // honeypot — bots fill it, humans don't
  const [serverError, setServerError] = useState("");

  const contactLinks = [
    { icon: Icons.mail, label: contact.email, href: `mailto:${contact.email}` },
    { icon: Icons.phone, label: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}` },
    { icon: Icons.github, label: stripScheme(contact.socials.github), href: contact.socials.github },
    { icon: Icons.linkedin, label: stripScheme(contact.socials.linkedin), href: contact.socials.linkedin },
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
        // Surface server-side field errors (422 carries them in `extra`).
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

  return (
    <section id="contact" className="section container-x" style={{ paddingTop: "7rem", paddingBottom: "3rem" }}>
      <Reveal><span className="eyebrow">05 — Contact</span></Reveal>

      <div
        className="contact-grid"
        style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.2fr)", gap: "3rem", marginTop: "1.4rem", alignItems: "start" }}
      >
        <Reveal>
          <h2 className="display-xl" style={{ fontSize: "clamp(1.9rem,4vw,3rem)", marginBottom: "1rem" }}>
            Let&apos;s build something <span className="grad-text">fast</span>.
          </h2>
          <p className="text-dim" style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
            Open to senior full-stack and Web3 roles, contracts and interesting problems. Drop a line — I reply quickly.
          </p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "1.8rem" }}>
            {contactLinks.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="glass"
                style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.8rem 1rem", color: "var(--text)", textDecoration: "none", borderRadius: 12 }}
              >
                <span className="grad-text">{c.icon()}</span>
                <span style={{ fontSize: "0.95rem" }}>{c.label}</span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <form className="grad-border" style={{ padding: "1.8rem" }} onSubmit={handleSubmit} noValidate>
            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: "2.5rem 1rem" }} role="status" aria-live="polite">
                <div
                  style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 1.2rem", display: "grid", placeItems: "center", color: "#04060a", background: "var(--accent-grad)", animation: "float-slow 2s ease-in-out infinite" }}
                >
                  {Icons.check({ width: 30, height: 30 })}
                </div>
                <h3 className="font-display" style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>Message sent</h3>
                <p className="text-dim" style={{ fontSize: "0.92rem" }}>Thanks for reaching out — I&apos;ll get back to you shortly.</p>
                <button type="button" className="btn btn-ghost" style={{ marginTop: "1.4rem" }} onClick={reset}>
                  Send another
                </button>
              </div>
            ) : (
              <>
                {/* Honeypot: hidden from users, attractive to bots. */}
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-row">
                  {(["name", "email"] as const).map((k) => (
                    <div key={k}>
                      <label htmlFor={k} style={{ fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "0.4rem", textTransform: "capitalize" }}>{k}</label>
                      <input
                        id={k}
                        type={k === "email" ? "email" : "text"}
                        className={`field${errors[k] && touched[k] ? " invalid" : ""}`}
                        placeholder={k === "email" ? "you@email.com" : "Your name"}
                        value={form[k]}
                        onChange={onChange(k)}
                        onBlur={onBlur(k)}
                        aria-invalid={!!(errors[k] && touched[k])}
                      />
                      {errors[k] && touched[k] && <div className="field-err">{errors[k]}</div>}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <label htmlFor="subject" style={{ fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Subject</label>
                  <input
                    id="subject"
                    type="text"
                    className={`field${errors.subject && touched.subject ? " invalid" : ""}`}
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={onChange("subject")}
                    onBlur={onBlur("subject")}
                  />
                  {errors.subject && touched.subject && <div className="field-err">{errors.subject}</div>}
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <label htmlFor="message" style={{ fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className={`field${errors.message && touched.message ? " invalid" : ""}`}
                    placeholder="Tell me about the role or project…"
                    value={form.message}
                    onChange={onChange("message")}
                    onBlur={onBlur("message")}
                    style={{ resize: "vertical" }}
                  />
                  {errors.message && touched.message && <div className="field-err">{errors.message}</div>}
                </div>
                {serverError && (
                  <div className="field-err" role="alert" style={{ marginTop: "1rem", textAlign: "center" }}>
                    {serverError}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1.4rem", opacity: status === "sending" ? 0.8 : 1 }}
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : <>Send message {Icons.arrow()}</>}
                </button>
                <p className="text-faint font-mono-custom" style={{ fontSize: "0.72rem", textAlign: "center", marginTop: "0.8rem" }}>
                  Your message lands straight in my inbox · I reply quickly
                </p>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
