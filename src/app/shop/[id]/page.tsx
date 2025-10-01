
"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Star, Loader2 } from "lucide-react";

import { type Product } from "@/lib/data";
import { PlaceHolderImages as placeholderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product-card";
import { AddToCartButton } from "./add-to-cart-button";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where, limit } from "firebase/firestore";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      setLoading(true);
      try {
        const productRef = doc(db, "products", params.id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = { id: productSnap.id, ...productSnap.data() } as Product;
          setProduct(productData);

          // Fetch related products
          const relatedQuery = query(
            collection(db, "products"),
            where("category", "==", productData.category),
            where("id", "!=", productData.id),
            limit(4)
          );
          const relatedSnap = await getDocs(relatedQuery);
          const relatedData = relatedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          setRelatedProducts(relatedData);

        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);


  if (loading) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return notFound();
  }
  
  const productImages = product.imageIds
    ?.map((id) => placeholderImages.find((p) => p.id === id))
    .filter(Boolean);

  const selectedImage = productImages?.[selectedImageIndex];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
            {selectedImage && (
              <Image
                src={product.imageUrl || selectedImage.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-ai-hint={selectedImage.imageHint}
                priority
              />
            )}
             {!selectedImage && product.imageUrl && (
                <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
          </div>
          {productImages && productImages.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {productImages.map((image, index) => (
                image && (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative aspect-square w-full rounded-md overflow-hidden transition-all",
                      index === selectedImageIndex
                        ? "ring-2 ring-primary ring-offset-2"
                        : "opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="20vw"
                      data-ai-hint={image.imageHint}
                    />
                  </button>
                )
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-headline text-3xl md:text-4xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
            </div>
            <span className="text-sm text-muted-foreground">(123 reviews)</span>
          </div>
          
          <div className="mt-4 flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                ₹{product.originalPrice?.toFixed(2)}
              </span>
            )}
            <span className="text-3xl font-bold text-foreground">
              ₹{product.price.toFixed(2)}
            </span>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col sm:flex-row gap-4">
            <AddToCartButton product={product} />
            <Button size="lg" className="w-full sm:w-auto">Buy Now</Button>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold font-headline">Description</h2>
            <p className="mt-4 text-muted-foreground">
              A brief, compelling description of the product would go here. It would highlight the key features and benefits for the customer.
            </p>
          </div>

        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Related Products</h2>
            <Button variant="link" asChild>
              <Link href="/shop">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
