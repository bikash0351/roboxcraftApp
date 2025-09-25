"use server";

import { getProductRecommendations } from "@/ai/flows/ai-product-recommendations";
import type { ProductRecommendationsOutput } from "@/ai/flows/ai-product-recommendations";

export async function getProductRecommendationsAction(
  browsingHistory: string,
  preferences: string
): Promise<ProductRecommendationsOutput | { error: string }> {
  try {
    const recommendations = await getProductRecommendations({
      browsingHistory,
      preferences,
    });
    return recommendations;
  } catch (error) {
    console.error(error);
    return { error: "Failed to get recommendations. Please try again." };
  }
}
