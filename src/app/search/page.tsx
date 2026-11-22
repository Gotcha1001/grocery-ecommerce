import Link from "next/link";
import FrontendLayout from "@/components/layouts/FrontendLayout";
import ProductCard from "@/components/product/ProductCard";
import { getSearchProducts } from "@/server-actions/products/getSearchProduct";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";

  const { products: searchResults } = await getSearchProducts(query);

  return (
    <FrontendLayout>
      <div className="my-6">
        <div className="flex-1">
          {/* Header */}
          <div>
            <p className="text-sm font-medium text-primary">Search Results</p>
            <h1 className="mt-1 text-2xl font-semibold text-text md:text-3xl">
              {query ? `"${query}"` : "Search Products"}
            </h1>
            {query && (
              <p className="mt-2 text-sm text-muted">
                {searchResults.length}{" "}
                {searchResults.length === 1 ? "product" : "products"} found
              </p>
            )}
          </div>

          {/* Products */}
          {searchResults.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex min-h-80 items-center justify-center rounded-xl border border-border bg-card px-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-text">
                  {query ? "No products found" : "What are you looking for?"}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {query
                    ? `We couldn't find anything matching "${query}".`
                    : "Type a product name in the search bar to get started."}
                </p>
                {query && (
                  <p className="mt-1 text-sm text-muted">
                    Check your spelling or try a more general term.
                  </p>
                )}
                <Link
                  href="/products"
                  className="mt-5 inline-block rounded bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
                >
                  Browse all products
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
}
