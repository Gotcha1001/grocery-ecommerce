"use server";
import { ai } from "@/lib/gemini";

export async function getGrocerySuggestions(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `You are a smart grocery shopping assistant for an online grocery.

Analyze the user's request and determine the groceries they would need.

Return ONLY valid JSON in this exact format:

{
  "items": [
    {
      "name": "string",
      "quantity": number
    }
  ]
}

Rules:
- Return grocery ingredients/products, not recipe instructions.
- Keep product names simple and searchable.
- Do not include explanations.
- Do not include prices.
- Do not invent products from the store.
- Quantity should represent the amount of the product needed.
- If the user specifies the number of people, adjust quantities appropriately.

User request: ${prompt}`,
    });

    const text = response.text;
    if (!text) {
      return {
        success: false,
        items: [],
        message: "No suggestions were generated.",
      };
    }

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanedText);

    if (
      typeof result !== "object" ||
      result === null ||
      !("items" in result) ||
      !Array.isArray(result.items)
    ) {
      return {
        success: false,
        items: [],
        message: "Invalid AI response.",
      };
    }

    return {
      success: true,
      items: result.items,
    };
  } catch (error) {
    console.error("GET_GROCERY_SUGGESTIONS_ERROR:", error);

    return {
      success: false,
      items: [],
      message: "Failed to generate grocery suggestions.",
    };
  }
}
