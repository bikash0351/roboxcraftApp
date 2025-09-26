
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/lib/data";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
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
