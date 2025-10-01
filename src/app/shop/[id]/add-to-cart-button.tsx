
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/lib/data";
import { Check, Loader2, ShoppingCart } from "lucide-react";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "added">("idle");

  const handleAddToCart = () => {
    setButtonState("loading");
    setTimeout(() => {
      const productToAdd = {
        ...product,
        imageId: product.imageIds[0] // Use the first image for the cart
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

  return (
    <Button 
      size="lg" 
      variant="outline" 
      onClick={handleAddToCart} 
      className="w-full sm:w-auto"
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
  );
}
