"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAddToCart } from "../cart/use-add-to-cart";
import { getCatalogLanding } from "../catalog/catalog-api";
import { getStoreProducts } from "./landing-api";
import { LandingProductCard } from "./landing-product-card";

export const STORE_CATEGORY_PARAM = "categoria";

/** New section: up to three featured products, selected in the backoffice. */
/** Editorial composition owned by the API: featured products and highlighted categories. */
function useLandingComposition() {
  return useQuery({
    queryFn: ({ signal }) => getCatalogLanding(signal),
    queryKey: ["catalog", "public", "landing"],
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });
}

export function FeaturedProducts() {
  const landingQuery = useLandingComposition();
  const { addProduct, isAdding } = useAddToCart();
  const featured = landingQuery.isError ? [] : landingQuery.data?.featuredProducts ?? [];
  if (!featured.length) return null;

  return (
    <section aria-labelledby="destacados-title" className="section section-paper" data-slot="landing-featured" id="destacados">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Productos destacados</span>
          <h2 id="destacados-title">Lo más elegido de la Tienda CDE.</h2>
          <p>Una selección de cursos y productos para comenzar.</p>
        </div>
        <div className="products-grid featured-grid">
          {featured.map((product) => (
            <LandingProductCard isAdding={isAdding} key={product.id} onAddToCart={(item) => void addProduct(item)} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** "Tienda CDE": "Todos" plus the highlighted categories, each listing all of its products. */
export function StoreSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addProduct, isAdding } = useAddToCart();
  const categoriesQuery = useLandingComposition();
  // Tabs are the categories highlighted in the backoffice (up to four), in their landing order.
  const categories = categoriesQuery.isError ? [] : categoriesQuery.data?.highlightedCategories.map(({ category }) => category) ?? [];
  const requested = searchParams.get(STORE_CATEGORY_PARAM);
  const selected = categories.find((category) => category.id === requested)?.id;
  const productsQuery = useQuery({
    enabled: !categoriesQuery.isPending,
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => getStoreProducts(selected, signal),
    queryKey: ["catalog", "public", "store-products", selected ?? "all"],
  });

  function select(categoryId: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) params.set(STORE_CATEGORY_PARAM, categoryId);
    else params.delete(STORE_CATEGORY_PARAM);
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}#tienda`, { scroll: false });
  }

  const products = productsQuery.data?.items ?? [];
  const hasMore = (productsQuery.data?.totalItems ?? 0) > products.length;

  return (
    <section aria-labelledby="tienda-title" className="section tienda" data-slot="landing-store" id="tienda">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Tienda CDE</span>
          <h2 id="tienda-title">Cursos, cuidado de la piel y equipos profesionales.</h2>
          <p>Formación para colegas médicos y una selección curada para el cuidado de la piel desde adentro y desde la cabina.</p>
        </div>

        <div aria-label="Filtrar la tienda por categoría" className="filters" role="group">
          <button aria-pressed={!selected} className="filter-btn" onClick={() => select(undefined)} type="button">Todos</button>
          {categories.map((category) => (
            <button aria-pressed={selected === category.id} className="filter-btn" key={category.id} onClick={() => select(category.id)} type="button">
              {category.name}
            </button>
          ))}
        </div>

        <div aria-busy={productsQuery.isFetching} aria-live="polite">
          {productsQuery.isPending ? <p className="store-state">Cargando la tienda…</p> : null}
          {productsQuery.isError || categoriesQuery.isError ? (
            <div className="store-state">
              <p>No pudimos cargar la tienda. Inténtalo nuevamente.</p>
              <button className="btn btn-gold" onClick={() => { void categoriesQuery.refetch(); void productsQuery.refetch(); }} type="button">Intentar nuevamente</button>
            </div>
          ) : null}
          {productsQuery.data && !productsQuery.isError && !products.length ? (
            <p className="store-state">Todavía no hay productos en esta categoría.</p>
          ) : null}
          {products.length && !productsQuery.isError ? (
            <div className="products-grid">
              {products.map((product) => (
                <LandingProductCard isAdding={isAdding} key={product.id} onAddToCart={(item) => void addProduct(item)} product={product} />
              ))}
            </div>
          ) : null}
          {hasMore ? (
            <div className="store-more">
              <Link className="btn btn-outline-light" href={`/products?${new URLSearchParams(selected ? { page: "1", categoryId: selected } : { page: "1" }).toString()}`}>
                Ver todos en el catálogo
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
