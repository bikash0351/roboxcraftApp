
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Star } from "lucide-react";

import { products } from "@/lib/data";
import { PlaceHolderImages as placeholderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product-card";
import { AddToCartButton } from "./add-to-cart-button";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const productImage = placeholderImages.find((p) => p.id === product.imageId);
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
          {productImage && (
            <Image
              src={productImage.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={productImage.imageHint}
            />
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
          <p className="mt-4 text-muted-foreground">
            A brief, compelling description of the product would go here. It would highlight the key features and benefits for the customer.
          </p>
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
        </div>
      </div>

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
    </div>
  );
}
