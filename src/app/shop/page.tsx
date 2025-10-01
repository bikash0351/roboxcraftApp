
"use client";

import { ProductCard } from '@/components/product-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from '@/lib/data';

export default function ShopPage() {
  const kits = products.filter((p) => p.category === 'Kits');
  const components = products.filter((p) => p.category === 'Components');

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue="kits" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kits">Kits</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>
        <TabsContent value="kits">
           <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl text-center mt-6">
            Complete Kits
          </h1>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {kits.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="components">
           <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl text-center mt-6">
            Components
          </h1>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {components.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
