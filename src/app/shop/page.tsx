import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/data';

export default function ShopPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
        All Products
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Browse our full catalog of robotic kits and components.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
