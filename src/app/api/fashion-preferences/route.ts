import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { imageUrl, preferences } = await request.json();
    const { budgetRange } = preferences;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }

    // Extract base64 data from data URL
    const base64Data = imageUrl.split(",")[1];

    // Analyze the image using OpenAI's Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this Instagram grid screenshot and identify the following fashion preferences, considering a ${budgetRange} budget level:\n
1. Color palette: List the dominant and accent colors used
2. Style categories: Identify fashion styles (e.g., minimalist, bohemian, streetwear)
3. Preferred clothing items: List specific types of clothing items featured
4. Common patterns or textures: Identify recurring patterns and fabric textures
5. Outfit combinations: Suggest 3-4 outfit combinations based on the style

Please provide recommendations that align with a ${budgetRange} budget while maintaining the essence of the style.
Format the analysis in a structured JSON format with the following keys: colorPalette, styleCategories, preferredItems, patterns, outfitCombinations.`,
            },
            {
              type: "image",
              image_url: {
                url: `data:image/jpeg;base64,${base64Data}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const analysis = response.choices[0].message.content;
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error analyzing fashion preferences:", error);
    return NextResponse.json(
      { error: "Failed to analyze fashion preferences" },
      { status: 500 }
    );
  }
}
