import type { ProductListItem } from "@technology-ecommerce/api-schemas";
import Link from "next/link";

import { formatProductPrice } from "../catalog/catalog-format";
import { ProductImage } from "../catalog/product-image";

export type StoreProduct = Pick<ProductListItem, "id" | "name" | "description" | "price" | "stockAvailable" | "image" | "coverImage"> & {
  category: { name: string } | null;
};

/** Product card of the CDE design (.product): category chip, cover, name, text, price, add. */
export function LandingProductCard({ isAdding, onAddToCart, product }: Readonly<{
  isAdding: boolean;
  onAddToCart: (product: Pick<StoreProduct, "id" | "name">) => void;
  product: StoreProduct;
}>) {
  const isOutOfStock = product.stockAvailable === 0;

  return (
    <article className="product" data-slot="product-card">
      <div className="product-media has-photo">
        <Link aria-label={`Ver detalle de ${product.name}`} className="product-media-link" href={`/products/${product.id}`}>
          <ProductImage
            alt={product.coverImage?.altText ?? product.name}
            fill
            sizes="(min-width: 1180px) 270px, (min-width: 720px) 45vw, 100vw"
            src={product.coverImage?.url ?? product.image.url}
          />
        </Link>
        {product.category ? <span className="product-cat">{product.category.name}</span> : null}
      </div>
      <div className="product-body">
        <h3><Link href={`/products/${product.id}`}>{product.name}</Link></h3>
        <p>{product.description}</p>
        {isOutOfStock ? <p className="stock-out">Agotado</p> : null}
        <div className="product-foot">
          <span className="price">{formatProductPrice(product.price)}</span>
          <button
            aria-label={`Agregar ${product.name} al carrito`}
            className="add-btn"
            disabled={isOutOfStock || isAdding}
            onClick={() => onAddToCart(product)}
            type="button"
          >
            <svg aria-hidden="true" fill="none" focusable="false" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            {isAdding ? "Agregando…" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}
