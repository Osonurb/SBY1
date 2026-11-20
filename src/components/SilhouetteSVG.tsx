import type { SilhouetteType } from "@/lib/types";

export function SilhouetteSVG({ type = "mystery" }: { type?: SilhouetteType }) {
  const cls = "w-24 h-24 text-[#F4F1EA]/20";
  if (type === "runner") {
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 80 80">
        <circle cx="46" cy="18" r="6" />
        <path
          d="M24 58 L38 42 L48 48 L58 64 M34 32 L46 28 L56 36 M12 46 H28 M8 54 H22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "mentor") {
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 80 80">
        <circle cx="40" cy="24" r="9" />
        <path d="M22 64 C22 48 58 48 58 64" strokeLinecap="round" />
        <circle cx="36" cy="24" r="3" />
        <circle cx="44" cy="24" r="3" />
        <path d="M39 24 H41" />
      </svg>
    );
  }
  if (type === "luck") {
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 80 80">
        <rect x="22" y="22" width="36" height="36" rx="4" transform="rotate(12 40 40)" />
        <circle cx="33" cy="33" r="2" fill="currentColor" />
        <circle cx="47" cy="47" r="2" fill="currentColor" />
        <circle cx="40" cy="40" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (type === "mystery") {
    return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="24" strokeDasharray="4 4" />
        <path d="M34 32 C34 27 46 27 46 33 C46 38 40 39 40 45" strokeLinecap="round" />
        <circle cx="40" cy="53" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 80 80">
      <circle cx="40" cy="25" r="9" />
      <path d="M20 66 C20 48 60 48 60 66" strokeLinecap="round" />
      <path d="M40 8 V12 M22 14 L25 17 M58 14 L55 17" strokeLinecap="round" />
    </svg>
  );
}
