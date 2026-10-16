import { createApiClient } from "@technology-ecommerce/api-client";
import { productPageSchema, type ProductPage } from "@technology-ecommerce/api-schemas";

const apiClient = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001",
});

/** One backend page per tab; larger categories link to the full catalog. */
export const STORE_PAGE_SIZE = 100;

export async function getStoreProducts(categoryId: string | undefined, signal?: AbortSignal): Promise<ProductPage> {
  const { data, error } = await apiClient.GET("/api/v1/products", {
    params: { query: { categoryId, page: 1, pageSize: STORE_PAGE_SIZE, sortBy: "createdAt", sortOrder: "asc", view: "public" } },
    signal,
  });
  if (error || !data) throw new Error("No fue posible cargar la tienda.");
  const page = productPageSchema.parse(data);
  return { ...page, items: page.items.filter((product) => product.status === "ACTIVE") };
}
