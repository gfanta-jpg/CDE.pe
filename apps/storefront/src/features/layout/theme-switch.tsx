"use client";

import { useThemeControl } from "@technology-ecommerce/ui";

/** Header light/dark switch; persistence and system preference live in ThemeProvider. */
export function ThemeSwitch() {
  const { theme, ready, toggle } = useThemeControl();
  const dark = theme === "dark";

  return (
    <button
      aria-label="Tema oscuro"
      aria-pressed={dark}
      className="storefront-icon-button"
      data-slot="theme-toggle"
      disabled={!ready}
      onClick={toggle}
      title={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      type="button"
    >
      <svg aria-hidden="true" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" viewBox="0 0 24 24">
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
          </>
        ) : (
          <path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1Z" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
