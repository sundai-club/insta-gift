"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Instagram,
  Palette,
  Sparkles,
  ShoppingBag,
  AlertCircle,
  Camera,
  Wand2,
  Shirt,
  TrendingUp,
} from "lucide-react";
import InstagramUpload from "@/components/InstagramUpload";

interface FashionPreference {
  colorPalette: string[];
  styleCategories: string[];
  preferredItems: string[];
  patterns: string[];
  outfitCombinations: string[];
}

const sampleStyles = [
  {
    name: "Minimalist Chic",
    description: "Clean lines, neutral colors, and timeless pieces",
    image: "/samples/minimalist.jpg",
  },
  {
    name: "Boho Spirit",
    description: "Free-spirited, layered, and earth-toned fashion",
    image: "/samples/bohemian.jpg",
  },
  {
    name: "Street Style",
    description: "Urban, bold, and trend-setting looks",
    image: "/samples/streetwear.jpg",
  },
];

const features = [
  {
    icon: Camera,
    title: "Upload Instagram Grid",
    description: "Share screenshots from your favorite fashion influencers",
  },
  {
    icon: Wand2,
    title: "AI Analysis",
    description: "Our AI breaks down the style elements that inspire you",
  },
  {
    icon: Shirt,
    title: "Style Profile",
    description: "Get a detailed breakdown of your fashion preferences",
  },
  {
    icon: TrendingUp,
    title: "Style Evolution",
    description: "Track how your style evolves over time",
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<FashionPreference | null>(null);

  const analyzeFashionPreferences = async (imageUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/fashion-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze fashion preferences");
      }

      const data = await response.json();
      setPreferences(JSON.parse(data.analysis));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-900/90 mix-blend-multiply" />
          <Image
            src="/hero-fashion.jpg"
            alt="Fashion collage"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Define Your Style
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Upload your favorite fashion influencer's Instagram grid and let AI
            decode your unique style preferences
          </p>
          <a
            href="#upload"
            className="inline-block bg-white text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-100 transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Styles Section */}
      <section className="py-20 px-4 bg-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Discover Your Style
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleStyles.map((style) => (
              <div
                key={style.name}
                className="group relative overflow-hidden rounded-xl aspect-[4/5]"
              >
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{style.name}</h3>
                  <p className="text-white/80">{style.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Upload Your Inspiration</h2>
            <p className="text-xl text-gray-600">
              Share your favorite fashion influencer's Instagram grid and let our AI analyze your style
            </p>
          </div>

          <InstagramUpload onUpload={analyzeFashionPreferences} />

          {isLoading && (
            <div className="text-center mt-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Analyzing your fashion preferences...</p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-50 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-500" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {preferences && (
            <div className="mt-12 space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="text-purple-500" />
                  <h2 className="text-xl font-semibold">Color Palette</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.colorPalette.map((color, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-50 rounded-full text-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-yellow-500" />
                  <h2 className="text-xl font-semibold">Style Categories</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.styleCategories.map((style, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-50 rounded-full text-sm"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="text-blue-500" />
                  <h2 className="text-xl font-semibold">Preferred Items</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.preferredItems.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Instagram className="text-pink-500" />
                  <h2 className="text-xl font-semibold">Outfit Combinations</h2>
                </div>
                <ul className="list-disc list-inside space-y-2">
                  {preferences.outfitCombinations.map((combo, index) => (
                    <li key={index} className="text-gray-700">
                      {combo}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
