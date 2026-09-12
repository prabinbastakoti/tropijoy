import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProductBySlug, getRelatedProducts } from "@/lib/products";
import ProductDetail from "@/components/product/ProductDetail";
import ProductReviews from "@/components/reviews/ProductReviews";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: PageParams) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />

      <div className="mt-8">
        <ProductDetail product={product} />
      </div>

      <div className="mt-20 pt-14 border-t border-forest/10">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-deep mb-10">
          Ratings &amp; Reviews
        </h2>
        <ProductReviews productId={product.id} productName={product.name} />
      </div>

      {related.length > 0 && (
        <div className="mt-20 pt-14 border-t border-forest/10">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-deep mb-10">
            You might also like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((item, i) => (
              <ProductCard key={item.id} product={item} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
