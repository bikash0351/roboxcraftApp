import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/data';

export default function ShopPage() {
  const kits = products.filter((p) => p.category === 'Kits');
  const components = products.filter((p) => p.category === 'Components');

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl text-center">
        Complete Kits
      </h1>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        {kits.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl text-center mt-12">
        Components
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {components.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
