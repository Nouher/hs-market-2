import { GoogleGenAI, Type } from "@google/genai";
import { ReviewData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateReviews = async (): Promise<ReviewData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate 3 short, punchy, and enthusiastic product reviews for 'AirPods 4th Gen Replicas' in Moroccan Arabic (Darija) mixed with some French/English tech terms if needed. The reviews should highlight sound quality, battery life, and the free protective case bonus. Use Moroccan names.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              author: { type: Type.STRING },
              rating: { type: Type.NUMBER, description: "Rating out of 5, usually 5 or 4" },
              text: { type: Type.STRING, description: "The review content in Arabic/Darija, max 20 words" },
            },
            required: ["author", "rating", "text"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as ReviewData[];
  } catch (error) {
    console.error("Failed to generate reviews:", error);
    // Fallback data in case of API failure in Arabic
    return [
      { author: "أمين التازي", rating: 5, text: "الصوت واعر بزاف بالنسبة لهاد الثمن! الباس قوي." },
      { author: "سارة ل.", rating: 5, text: "عجبني الكاش اللي جا معاها فابور. البطارية كتشد نهار كامل." },
      { author: "كريم ب.", rating: 4, text: "ماكاينش فرق بينها وبين الأصلية. التوصيل كان سريع." }
    ];
  }
};