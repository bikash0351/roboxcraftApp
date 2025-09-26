
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/lib/data";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      imageId: product.imageIds[0] // Use the first image for the cart
    };
    addItem(productToAdd);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Button size="lg" variant="outline" onClick={handleAddToCart} className="w-full sm:w-auto">
      Add to Cart
    </Button>
  );
}
