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
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What are the main interests and hobbies shown in this Instagram grid? List only single words or short phrases, one per line.",
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

    const interests = response.choices[0].message.content
      ?.split("\n")
      .map((interest) => interest.trim().toLowerCase())
      .filter((interest) => interest && interest.split(" ").length <= 3);

    return interests || getFallbackInterests();
  } catch (error) {
    console.error("Error analyzing image:", error);
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
          content:
            "You are a gift recommendation expert. Generate ONE gift recommendation in this exact JSON format: {'name': 'Gift Name', 'description': 'Description', 'price': 29.99, 'match_reason': 'Why this matches'}",
        },
        {
          role: "user",
          content: `Suggest ONE specific gift for a ${age} year old who likes ${interest}. Budget: $${budget}. Return ONLY the JSON.`,
        },
      ],
      temperature: 0.7,
    });

    const recommendationText =
      response.choices[0].message.content?.replace(/'/g, '"') || "{}";
    const recommendation = JSON.parse(recommendationText);

    return {
      name: recommendation.name || "Gift suggestion",
      description: recommendation.description || "",
      price: parseFloat(
        String(recommendation.price || budget).replace("$", "")
      ),
      match_reason: recommendation.match_reason || "",
      amazon_link: `https://www.amazon.com/s?k=${encodeURIComponent(
        recommendation.name || ""
      )}`,
      etsy_link: `https://www.etsy.com/search?q=${encodeURIComponent(
        recommendation.name || ""
      )}`,
    };
  } catch (error) {
    console.error("Error generating recommendation:", error);
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
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const age = Number(formData.get("age"));
    const interests = String(formData.get("interests") || "");
    const budget = Number(formData.get("budget"));
    const imageFile = formData.get("instagram-grid") as File | null;

    if (!age || !budget) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get interests from both image and text input
    let allInterests = interests
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString("base64");

      const imageInterests = await analyzeImage(base64Image);
      allInterests = [...allInterests, ...imageInterests];
    }

    // Ensure we have some interests
    if (allInterests.length === 0) {
      allInterests = getFallbackInterests();
    }

    // Get unique interests and shuffle them
    const uniqueInterests = [...new Set(allInterests)]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Generate recommendations
    const recommendations = await Promise.all(
      uniqueInterests.map((interest) =>
        generateGiftRecommendation(interest, age, budget)
      )
    );

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Gift API Error:", error);
    return NextResponse.json(
      { error: "Failed to get gift recommendations" },
      { status: 500 }
    );
  }
}
