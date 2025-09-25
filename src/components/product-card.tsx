"use client";

import Image from "next/image";
import type { Product } from "@/lib/data";
import { PlaceHolderImages as placeholderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product & { description?: string; imageUrl?: string };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const productImage = placeholderImages.find((p) => p.id === product.imageId);
  const imageSrc = product.imageUrl || productImage?.imageUrl;
  const imageHint = productImage?.imageHint;

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="relative p-0">
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
      <CardFooter className="p-4 pt-2">
        <Button className="w-full" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
