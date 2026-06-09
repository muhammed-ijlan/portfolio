"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  words: string[];
  className?: string;
}

export function Typewriter({ words, className = "" }: TypewriterProps) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(words[0]);
      return;
    }
    const current = words[idx % words.length];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && text === current) {
      t = setTimeout(() => setDeleting(true), 1500);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIdx((v) => v + 1);
    } else {
      t = setTimeout(() => {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      }, deleting ? 45 : 85);
    }
    return () => clearTimeout(t);
  }, [text, deleting, idx, words]);

  return (
    <span className={className}>
      {text}
      <span className="blink" style={{ color: "var(--cyan)", fontWeight: 400 }}>|</span>
    </span>
  );
}
