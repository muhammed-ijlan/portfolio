export function motionDisabled(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return document.documentElement.dataset.animations === "off";
}
