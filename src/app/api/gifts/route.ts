import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GiftRecommendation {
  name: string;
  description: string;
  price: number;
  match_reason: string;
  amazon_link?: string;
  etsy_link?: string;
}

async function analyzeImage(base64Image: string): Promise<string[]> {
  try {
    console.log("[Image Analysis] Starting image analysis...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this Instagram grid and list the main interests and hobbies shown. List only single words or short phrases, one per line. Focus on activities, hobbies, and lifestyle preferences visible in the images.",
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const rawResponse = response.choices[0].message.content;
    console.log("[Image Analysis] Raw GPT response:", rawResponse);

    const interests = rawResponse
      ?.split("\n")
      .map((interest) => interest.trim().toLowerCase())
      .filter((interest) => interest && interest.split(" ").length <= 3);

    console.log("[Image Analysis] Processed interests:", interests);

    if (!interests || interests.length === 0) {
      console.log("[Image Analysis] No interests found, using fallback");
      return getFallbackInterests();
    }

    return interests;
  } catch (error) {
    console.error("[Image Analysis] Error:", error);
    return getFallbackInterests();
  }
}

function getFallbackInterests(): string[] {
  return [
    "technology",
    "fashion",
    "home decor",
    "books",
    "fitness",
    "cooking",
    "music",
  ];
}

async function generateGiftRecommendation(
  interest: string,
  age: number,
  budget: number
): Promise<GiftRecommendation> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a gift recommendation expert. Respond with ONLY a JSON object in this exact format:
{
  "name": "Gift Name",
  "description": "Brief description without any apostrophes",
  "price": 29.99,
  "match_reason": "Why this matches, avoid using apostrophes"
}`,
        },
        {
          role: "user",
          content: `Suggest ONE specific gift for a ${age} year old who likes ${interest}. Budget: $${budget}. Avoid using apostrophes in descriptions.`,
        },
      ],
      temperature: 0.7,
    });

    let recommendationText =
      response.choices[0].message.content?.trim() || "{}";

    // Extract JSON if it's wrapped in other text
    const jsonMatch = recommendationText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      recommendationText = jsonMatch[0];
    }

    // Clean up the JSON string
    recommendationText = recommendationText
      .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
      .replace(/[\u2018\u2019]/g, "'") // Replace smart single quotes
      .replace(/'/g, "'") // Standardize single quotes
      .replace(/\n/g, " ")
      .replace(/,\s*}/g, "}")
      .replace(/\s+/g, " ")
      .replace(/\s*:\s*/g, ":")
      .replace(/\s*,\s*/g, ",")
      .replace(/it['']s/gi, "it is") // Replace problematic contractions
      .replace(/['']s\s/g, "s ") // Handle possessives
      .replace(/['']re\s/g, " are ") // Handle other contractions
      .replace(/['']t\s/g, "t "); // Handle 't' contractions

    try {
      const recommendation = JSON.parse(recommendationText);

      // Validate required fields
      if (
        !recommendation.name ||
        !recommendation.description ||
        !recommendation.match_reason
      ) {
        throw new Error("Missing required fields in recommendation");
      }

      // Clean up any remaining problematic characters in the text fields
      const cleanText = (text: string) =>
        text.replace(/[''"]/g, "").replace(/\s+/g, " ").trim();

      return {
        name: cleanText(recommendation.name),
        description: cleanText(recommendation.description),
        price: parseFloat(
          String(recommendation.price || budget).replace(/[$,]/g, "")
        ),
        match_reason: cleanText(recommendation.match_reason),
        amazon_link: `https://www.amazon.com/s?k=${encodeURIComponent(
          recommendation.name
        )}`,
        etsy_link: `https://www.etsy.com/search?q=${encodeURIComponent(
          recommendation.name
        )}`,
      };
    } catch (parseError) {
      console.error("Error parsing recommendation:", parseError);
      console.error("Raw text:", recommendationText);
      // Fall through to default recommendation
    }
  } catch (error) {
    console.error("Error generating recommendation:", error);
  }

  // Default recommendation if anything fails
  return {
    name: `${interest.charAt(0).toUpperCase() + interest.slice(1)} Gift Set`,
    description: `A curated gift set for ${interest} enthusiasts`,
    price: budget,
    match_reason: `Perfect for someone who loves ${interest}`,
    amazon_link: `https://www.amazon.com/s?k=${encodeURIComponent(
      interest
    )}+gift`,
    etsy_link: `https://www.etsy.com/search?q=${encodeURIComponent(
      interest
    )}+gift`,
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const age = Number(formData.get("age"));
    const interests = String(formData.get("interests") || "");
    const budget = Number(formData.get("budget"));
    const imageFile = formData.get("instagram-grid") as File | null;

    console.log("[API] Received request:", {
      age,
      interests,
      budget,
      hasImage: !!imageFile,
    });

    if (!age || !budget) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get interests from text input (if any)
    let allInterests = interests
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    console.log("[API] Manual interests:", allInterests);

    // If we have an image, analyze it for interests
    if (imageFile) {
      console.log("[API] Processing uploaded image...");
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString("base64");
      console.log("[API] Image converted to base64");

      const imageInterests = await analyzeImage(base64Image);
      console.log("[API] Interests from image:", imageInterests);

      allInterests = [...allInterests, ...imageInterests];
    }

    // If no interests provided and no image uploaded, use fallback interests
    if (allInterests.length === 0) {
      console.log("[API] Using fallback interests");
      allInterests = getFallbackInterests();
    }

    console.log("[API] Final combined interests:", allInterests);

    // Get unique interests and shuffle them
    const uniqueInterests = [...new Set(allInterests)]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    console.log(
      "[API] Selected interests for recommendations:",
      uniqueInterests
    );

    // Generate recommendations
    const recommendations = await Promise.all(
      uniqueInterests.map((interest) =>
        generateGiftRecommendation(interest, age, budget)
      )
    );

    console.log("[API] Generated recommendations:", recommendations);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("[API] Error:", error);
    return NextResponse.json(
      { error: "Failed to get gift recommendations" },
      { status: 500 }
    );
  }
}
