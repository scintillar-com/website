import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "horizontal" | "standalone";
  className?: string;
}

/** Scintillar logo. Swaps the light/dark artwork with CSS so it never flashes on load. */
export function Logo({ variant = "horizontal", className }: LogoProps) {
  const size = variant === "horizontal" ? { width: 150, height: 36 } : { width: 40, height: 31 };
  return (
    <span className={cn("inline-flex", className)}>
      <Image
        src={`/brand/scintillar-logo-${variant}-light.svg`}
        alt="Scintillar"
        {...size}
        priority
        className="h-auto dark:hidden"
      />
      <Image
        src={`/brand/scintillar-logo-${variant}-dark.svg`}
        alt="Scintillar"
        {...size}
        priority
        className="hidden h-auto dark:block"
      />
    </span>
  );
}
