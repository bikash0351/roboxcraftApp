
"use client";

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Product } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import AiRecommendations from '@/components/ai-recommendations';


export default function ShopPage() {
  const [kits, setKits] = useState<Product[]>([]);
  const [components, setComponents] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, "products");
        
        const kitsQuery = query(productsRef, where("category", "==", "Kits"));
        const componentsQuery = query(productsRef, where("category", "==", "Components"));
        
        const [kitsSnapshot, componentsSnapshot] = await Promise.all([
          getDocs(kitsQuery),
          getDocs(componentsQuery)
        ]);

        const kitsData = kitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        const componentsData = componentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

        setKits(kitsData);
        setComponents(componentsData);

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }

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
