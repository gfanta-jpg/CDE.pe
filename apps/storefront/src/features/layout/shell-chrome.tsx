"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** The CDE landing brings its own nav and footer; every other page keeps the shell chrome. */
export function ShellChrome({ children }: Readonly<{ children: ReactNode }>) {
  return usePathname() === "/" ? null : <>{children}</>;
}
