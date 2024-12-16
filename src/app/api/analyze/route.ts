import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { writeFile } from "fs/promises";
import path from "path";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface InstagramAnalyzer {
  analyzeImage(base64Image: string): Promise<string[]>;
  adjustInterestsByAge(interests: string[], age: number): string[];
}

class InstagramAnalyzerImpl implements InstagramAnalyzer {
  async analyzeImage(base64Image: string): Promise<string[]> {
    try {
      const completion = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content:
              "You are a gift recommendation expert analyzing Instagram images to identify interests and hobbies.",
          },
          {
            role: "user",
            content:
              "What are the main interests and hobbies shown in this Instagram grid? List only single words or short phrases, one per line.",
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const interests = completion.choices[0]?.message?.content
        ?.split("\n")
        .filter(Boolean)
        .map((interest) => interest.trim());

      return interests || [];
    } catch (error) {
      console.error("Error analyzing image:", error);
      return [];
    }
  }

  adjustInterestsByAge(interests: string[], age: number): string[] {
    if (age < 13) {
      return [
        "toys",
        "games",
        "art supplies",
        "books",
        "educational toys",
        "sports equipment",
        "creative activities",
      ];
    }
    if (age < 18) {
      const teenSafe = [
        ...interests,
        "gaming",
        "sports",
        "music",
        "art",
        "technology",
      ];
      return Array.from(new Set(teenSafe)).slice(0, 7);
    }
    return interests;
  }

  private getFallbackInterests(): string[] {
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
}

class GiftService {
  async generateRecommendation(interest: string, age: number, budget: number) {
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
      };
    } catch (error) {
      console.error("Error generating recommendation:", error);
      return {
        name: `${
          interest.charAt(0).toUpperCase() + interest.slice(1)
        } Gift Set`,
        description: `A curated gift set for ${interest} enthusiasts`,
        price: budget,
        match_reason: `Perfect for someone who loves ${interest}`,
        amazon_link: `https://www.amazon.com/s?k=${encodeURIComponent(
          interest
        )}+gift`,
      };
    }
  }

  async getGiftRecommendations(
    interests: string[],
    age: number,
    budget: number
  ) {
    const shuffledInterests = [...interests].sort(() => Math.random() - 0.5);
    const selectedInterests = shuffledInterests.slice(0, 3);

    const recommendations = await Promise.all(
      selectedInterests.map((interest) =>
        this.generateRecommendation(interest, age, budget)
      )
    );

    return recommendations;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("instagram-grid") as File;
    const age = Number(formData.get("age"));
    const budget = Number(formData.get("budget"));
    const interests = String(formData.get("interests") || "");

    if (!file || !age || !budget) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Analyze image and get recommendations
    const analyzer = new InstagramAnalyzerImpl();
    const imageInterests = await analyzer.analyzeImage(base64Image);
    const adjustedInterests = analyzer.adjustInterestsByAge(
      [...imageInterests, ...interests.split(",").map((i) => i.trim())],
      age
    );

    const giftService = new GiftService();
    const recommendations = await giftService.getGiftRecommendations(
      adjustedInterests,
      age,
      budget
    );

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error in analyze route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
