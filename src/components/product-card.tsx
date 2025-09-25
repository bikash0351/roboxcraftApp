"use client";

import Image from "next/image";
import type { Product } from "@/lib/data";
import { PlaceHolderImages as placeholderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product & { description?: string, imageUrl?: string };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const productImage = placeholderImages.find(p => p.id === product.imageId);
  const imageSrc = product.imageUrl || productImage?.imageUrl;
  const imageHint = productImage?.imageHint;

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full bg-muted">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={imageHint}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="line-clamp-2 text-base font-semibold">{product.name}</CardTitle>
        {product.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>}
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
        <Button size="icon" variant="outline" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">Add to cart</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
