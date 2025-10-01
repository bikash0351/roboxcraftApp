
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Product } from "@/lib/data";
import { PlaceHolderImages as placeholderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { Check, Loader2, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product & { description?: string; imageUrl?: string };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "added">("idle");

  const handleAddToCart = () => {
    setButtonState("loading");
    setTimeout(() => {
      const productToAdd = {
        ...product,
        imageId: product.imageIds ? product.imageIds[0] : 'ai-product',
      };
      addItem(productToAdd);
      setButtonState("added");
    }, 500); // Simulate network delay
  };

  useEffect(() => {
    if (buttonState === "added") {
      const timer = setTimeout(() => setButtonState("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [buttonState]);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  const primaryImageId = product.imageIds ? product.imageIds[0] : 'ai-product';
  const productImage = placeholderImages.find((p) => p.id === primaryImageId);
  const imageSrc = product.imageUrl || productImage?.imageUrl;
  const imageHint = productImage?.imageHint;

  return (
    <Card className="flex flex-col overflow-hidden">
      <Link href={`/shop/${product.id}`} className="flex flex-col flex-1">
        <CardHeader className="relative p-0">
          <div className="relative aspect-square w-full bg-muted">
            {imageSrc && (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={imageHint}
              />
            )}
            {hasDiscount && (
              <Badge
                variant="destructive"
                className={cn(
                  "absolute top-2 left-2 rounded-full h-10 w-10 flex items-center justify-center text-sm font-bold bg-primary text-primary-foreground",
                  "border-2 border-background"
                  )}
              >
                -{discountPercentage}%
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 pb-2">
          <h3 className="line-clamp-2 font-semibold h-12">{product.name}</h3>
          {product.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="mt-2 flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-foreground">
              ₹{product.price.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-2">
        <Button 
          className="w-full" 
          onClick={handleAddToCart} 
          disabled={buttonState !== 'idle'}
        >
          {buttonState === 'loading' && (
            <>
              <Loader2 className="animate-spin" />
              Adding...
            </>
          )}
          {buttonState === 'added' && (
            <>
              <Check />
              Added to Cart
            </>
          )}
          {buttonState === 'idle' && (
            <>
              <ShoppingCart />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
