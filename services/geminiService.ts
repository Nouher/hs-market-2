import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ReviewData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenerativeAI(process.env.API_KEY || "");

export const generateReviews = async (): Promise<ReviewData[]> => {
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              author: { type: SchemaType.STRING },
              rating: { type: SchemaType.NUMBER },
              text: { type: SchemaType.STRING },
            },
            required: ["author", "rating", "text"],
          },
        },
      },
    });

    const result = await model.generateContent(
      "Generate 3 short, punchy, and enthusiastic product reviews for 'AirPods 4th Gen Replicas' in Moroccan Arabic (Darija). Each under 20 words."
    );

    const text = result.response.text();
    if (!text) return [];

    return JSON.parse(text) as ReviewData[];
  } catch (error) {
    console.error("Failed to generate reviews:", error);

    // Fallback reviews
    return [
      { author: "أمين التازي", rating: 5, text: "الصوت زوين بزاف والثمن مناسب بزاف!" },
      { author: "سارة ل.", rating: 5, text: "البطارية كتبقى معايا نهار كامل والكاش فابور!" },
      { author: "كريم ب.", rating: 4, text: "التوصيل كان سريع، الجودة مزيانة!" }
    ];
  }
};
