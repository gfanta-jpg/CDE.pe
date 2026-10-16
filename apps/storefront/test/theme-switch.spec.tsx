import { ThemeProvider } from "@technology-ecommerce/ui";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeSwitch } from "../src/features/layout/theme-switch";

const storageKey = "technology-ecommerce:storefront:theme";

function renderSwitch() {
  return render(
    <ThemeProvider application="storefront" floatingToggle={false}>
      <header><ThemeSwitch /></header>
    </ThemeProvider>,
  );
}

describe("storefront header theme switch", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal("matchMedia", () => Object.assign(new EventTarget(), { matches: false }));
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("toggles light/dark, persists the explicit choice and replaces the floating toggle", async () => {
    renderSwitch();
    const toggle = screen.getByRole("button", { name: "Tema oscuro" });
    await waitFor(() => expect(toggle).toBeEnabled());
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.querySelectorAll('[data-slot="theme-toggle"]')).toHaveLength(1);

    await userEvent.setup().click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("title", "Cambiar a tema claro");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem(storageKey)).toBe("dark");
  });

  it("starts from the stored preference and works from the keyboard", async () => {
    window.localStorage.setItem(storageKey, "dark");
    renderSwitch();
    const toggle = screen.getByRole("button", { name: "Tema oscuro" });
    await waitFor(() => expect(toggle).toHaveAttribute("aria-pressed", "true"));

    toggle.focus();
    await userEvent.setup().keyboard("{Enter}");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem(storageKey)).toBe("light");
  });
});
