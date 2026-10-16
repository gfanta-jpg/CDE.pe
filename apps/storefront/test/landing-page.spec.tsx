import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { CatalogLanding, ProductListItem, ProductPage } from "@technology-ecommerce/api-schemas";
import { FlashRegion, useFlashStore } from "@technology-ecommerce/ui";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSessionStore } from "../src/features/auth/session";
import { addCartItem, getCart } from "../src/features/cart/cart-api";
import { getCatalogLanding } from "../src/features/catalog/catalog-api";
import { getStoreProducts } from "../src/features/landing/landing-api";
import { LandingPage } from "../src/features/landing/landing-page";

const navigation = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), searchParams: new URLSearchParams() }));
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: navigation.push, replace: navigation.replace }),
  useSearchParams: () => navigation.searchParams,
}));
vi.mock("../src/features/catalog/catalog-api", () => ({ getCatalogLanding: vi.fn() }));
vi.mock("../src/features/landing/landing-api", () => ({ getStoreProducts: vi.fn() }));
vi.mock("../src/features/layout/theme-switch", () => ({ ThemeSwitch: () => <button type="button">Tema oscuro</button> }));
vi.mock("../src/features/cart/cart-api", async (importOriginal) => ({
  ...await importOriginal<typeof import("../src/features/cart/cart-api")>(), addCartItem: vi.fn(), getCart: vi.fn(),
}));

const CURSOS = { id: "20000000-0000-4000-8000-000000000001", name: "Cursos" };
const CATEGORIES = [CURSOS, { id: "20000000-0000-4000-8000-000000000002", name: "Colágeno" },
  { id: "20000000-0000-4000-8000-000000000003", name: "Suplementos" }, { id: "20000000-0000-4000-8000-000000000004", name: "Equipos láser" }];

function product(index: number, name: string, category = CURSOS, stockAvailable = 5): ProductListItem {
  return {
    id: `10000000-0000-4000-8000-${String(index).padStart(12, "0")}`, sku: `SKU-${index}`, slug: `p-${index}`, name,
    description: `Descripción ${index}`, price: "145.00", currency: "USD", status: "ACTIVE", stockAvailable,
    category: { ...category, slug: `c-${index}`, status: "ACTIVE" }, tags: [],
    image: { storageKey: "k", url: "https://res.cloudinary.com/demo/image/upload/v1/codex-storefront/a.jpg" },
    coverImage: null, createdAt: "2026-10-15T12:00:00.000Z", updatedAt: "2026-10-15T12:00:00.000Z",
  } as ProductListItem;
}

function page(items: ProductListItem[]): ProductPage {
  return { items, page: 1, pageSize: 100, totalItems: items.length, totalPages: 1 };
}

// Highlighted categories (up to four, in landing order) drive the store tabs.
function landing(featured: ProductListItem[], categories = CATEGORIES): CatalogLanding {
  return {
    featuredProducts: featured as CatalogLanding["featuredProducts"], latestProducts: [],
    highlightedCategories: categories.map((category, index) => ({
      category: { ...category, slug: `cat-${index}`, status: "ACTIVE" as const },
      products: [product(90 + index, `Muestra ${index}`, category)] as CatalogLanding["featuredProducts"],
    })),
  };
}

function renderLanding() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}><LandingPage /><FlashRegion appearance="storefront" /></QueryClientProvider>);
}

beforeEach(() => {
  vi.mocked(getCatalogLanding).mockReset().mockResolvedValue(landing([]));
  vi.mocked(getStoreProducts).mockReset().mockResolvedValue(page([]));
  vi.mocked(getCart).mockReset().mockResolvedValue({
    createdAt: "2026-10-15T12:00:00.000Z", currency: null, customerId: null, id: "f69d57cb-3473-4ee4-8474-5d71aefbcbe5",
    items: [], status: "ACTIVE", subtotal: "0.00", total: "0.00", totalQuantity: 0, updatedAt: "2026-10-15T12:00:00.000Z",
  });
  vi.mocked(addCartItem).mockReset();
  navigation.push.mockReset();
  navigation.replace.mockReset();
  navigation.searchParams = new URLSearchParams();
  useSessionStore.setState({ notice: null, session: null, status: "anonymous" });
  useFlashStore.getState().dismissFlash();
});

describe("CDE landing", () => {
  it("keeps every section of the CDE design with its original texts and links", async () => {
    renderLanding();
    expect(screen.getByRole("heading", { level: 1, name: /^Ecografía dermatológica y estética,\s*en alta resolución\.$/ })).toBeInTheDocument();
    for (const heading of ["Un ojo radiológico, aplicado a la piel.", "Temas que la Dra. Kusch trata cada semana en consulta.",
      "Educación que también se ve en el feed.", "De la consulta y el feed, a una lectura completa.",
      "Cursos, cuidado de la piel y equipos profesionales.", "Evidencia antes que suposición.", "Agenda tu evaluación ecográfica."]) {
      expect(screen.getByRole("heading", { level: 2, name: heading })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Agendar por WhatsApp" })).toHaveAttribute("href", expect.stringContaining("https://wa.me/51952100364"));
    expect(screen.getByRole("img", { name: "Dra. Anne Kusch junto a un equipo de ecografía" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Secciones" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver carrito, 0 unidades/ })).toHaveAttribute("href", "/cart");
    await waitFor(() => expect(getStoreProducts).toHaveBeenCalled());
  });

  it("adds a featured section with up to three products, and hides it when none is featured", async () => {
    vi.mocked(getCatalogLanding).mockResolvedValue(landing([product(1, "Curso online"), product(2, "Masterclass"), product(3, "Capacitación")]));
    const { unmount } = renderLanding();
    const section = await screen.findByRole("region", { name: "Lo más elegido de la Tienda CDE." });
    expect(within(section).getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual(["Curso online", "Masterclass", "Capacitación"]);
    unmount();

    vi.mocked(getCatalogLanding).mockResolvedValue(landing([]));
    renderLanding();
    await waitFor(() => expect(getCatalogLanding).toHaveBeenCalledTimes(2));
    expect(screen.queryByRole("region", { name: "Lo más elegido de la Tienda CDE." })).not.toBeInTheDocument();
  });

  it("lists every product under 'Todos' and offers the highlighted categories as tabs, whatever their names", async () => {
    vi.mocked(getStoreProducts).mockResolvedValue(page([product(1, "Curso online"), product(2, "Colágeno marino", CATEGORIES[1])]));
    renderLanding();
    const store = screen.getByRole("region", { name: "Cursos, cuidado de la piel y equipos profesionales." });
    expect(await within(store).findByRole("heading", { name: "Colágeno marino" })).toBeInTheDocument();
    const tabs = within(store).getByRole("group", { name: "Filtrar la tienda por categoría" });
    expect(within(tabs).getAllByRole("button").map((button) => button.textContent)).toEqual(["Todos", "Cursos", "Colágeno", "Suplementos", "Equipos láser"]);
    expect(within(tabs).getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");
    expect(getStoreProducts).toHaveBeenLastCalledWith(undefined, expect.any(AbortSignal));
  });

  it("uses exactly the categories highlighted in the backoffice, in their landing order", async () => {
    const custom = [{ id: "30000000-0000-4000-8000-000000000001", name: "Ofertas" }, { id: "30000000-0000-4000-8000-000000000002", name: "Aparatología" }];
    vi.mocked(getCatalogLanding).mockResolvedValue(landing([], custom));
    renderLanding();
    const tabs = await screen.findByRole("group", { name: "Filtrar la tienda por categoría" });
    await waitFor(() => expect(within(tabs).getAllByRole("button").map((button) => button.textContent)).toEqual(["Todos", "Ofertas", "Aparatología"]));
  });

  it("keeps the selected category in the URL and loads all of its products", async () => {
    renderLanding();
    await userEvent.setup().click(await screen.findByRole("button", { name: "Equipos láser" }));
    expect(navigation.replace).toHaveBeenCalledWith(`/?categoria=${CATEGORIES[3]!.id}#tienda`, { scroll: false });

    navigation.searchParams = new URLSearchParams(`categoria=${CURSOS.id}`);
    vi.mocked(getStoreProducts).mockResolvedValue(page([product(1, "Curso online"), product(2, "Masterclass")]));
    renderLanding();
    await waitFor(() => expect(getStoreProducts).toHaveBeenLastCalledWith(CURSOS.id, expect.any(AbortSignal)));
    const pressed = (await screen.findAllByRole("button", { name: "Cursos" })).at(-1);
    expect(pressed).toHaveAttribute("aria-pressed", "true");
  });

  it("ignores an unknown category in the URL and falls back to 'Todos'", async () => {
    navigation.searchParams = new URLSearchParams("categoria=not-a-store-category");
    renderLanding();
    await waitFor(() => expect(getStoreProducts).toHaveBeenCalledWith(undefined, expect.any(AbortSignal)));
    expect(await screen.findByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");
  });

  it("adds a store product to the cart and disables exhausted products", async () => {
    const available = product(1, "Colágeno marino", CATEGORIES[1]);
    vi.mocked(getStoreProducts).mockResolvedValue(page([available, product(2, "Masterclass", CURSOS, 0)]));
    vi.mocked(addCartItem).mockResolvedValue({
      createdAt: "2026-10-15T12:00:00.000Z", currency: "USD", customerId: null, id: "f69d57cb-3473-4ee4-8474-5d71aefbcbe5",
      items: [], status: "ACTIVE", subtotal: "145.00", total: "145.00", totalQuantity: 1, updatedAt: "2026-10-15T12:00:00.000Z",
    });
    renderLanding();
    expect(await screen.findByRole("button", { name: "Agregar Masterclass al carrito" })).toBeDisabled();
    await userEvent.setup().click(screen.getByRole("button", { name: "Agregar Colágeno marino al carrito" }));
    expect(addCartItem).toHaveBeenCalledWith(undefined, available.id, 1);
  });

  it("shows a safe error with retry when the store cannot load", async () => {
    vi.mocked(getStoreProducts).mockRejectedValueOnce(new Error("Internal database details"));
    renderLanding();
    expect(await screen.findByText("No pudimos cargar la tienda. Inténtalo nuevamente.")).toBeInTheDocument();
    expect(screen.queryByText("Internal database details")).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Intentar nuevamente" }));
    expect(await screen.findByText("Todavía no hay productos en esta categoría.")).toBeInTheDocument();
  });

  it("keeps the contact form as a preview that only shows the design notice", async () => {
    renderLanding();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Nombre completo"), "Ana");
    await user.type(screen.getByLabelText("WhatsApp"), "+51 900 000 000");
    await user.click(screen.getByRole("button", { name: "Solicitar contacto" }));
    expect(useFlashStore.getState().flash).toEqual({ tone: "info", message: "Gracias — este formulario es una vista previa; conéctalo a tu correo o CRM al publicar el sitio." });
  });

  it("opens the full blog article in a modal dialog", async () => {
    const showModal = vi.fn();
    HTMLDialogElement.prototype.showModal = showModal;
    renderLanding();
    await userEvent.setup().click(screen.getByRole("button", { name: /Leer artículo completo/ }));
    expect(showModal).toHaveBeenCalledTimes(1);
  });
});
