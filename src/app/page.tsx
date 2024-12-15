"use client";

import Image from "next/image";
import {
  Camera,
  User,
  DollarSign,
  Sparkles,
  Gift,
  Instagram,
  Heart,
  Palette,
  Dumbbell,
  Laptop,
  Cake,
  Tag,
  AlertCircle,
  ShoppingCart,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

interface GiftRecommendation {
  name: string;
  price: number;
  description: string;
  match_reason: string;
  amazon_link?: string;
  etsy_link?: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<GiftRecommendation[]>(
    []
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/gifts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations);

      // Scroll to results
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      setError("Failed to get gift recommendations. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-holiday-red to-holiday-green p-4 sm:p-8 relative overflow-hidden">
      {/* Snowflakes Animation Container */}
      <div className="absolute inset-0 pointer-events-none" id="snowflakes" />

      <div className="container max-w-6xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-12 h-12 text-holiday-red mr-4" />
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-holiday-red to-holiday-green bg-clip-text text-transparent">
              InstaGift
            </h1>
            <Gift className="w-12 h-12 text-holiday-green ml-4" />
          </div>
          <p className="text-xl text-gray-700 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-holiday-gold" />
            Discover the Perfect Holiday Gifts with AI Magic!
            <Sparkles className="w-5 h-5 text-holiday-gold" />
          </p>
        </header>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Instagram className="w-8 h-8 text-holiday-red" />
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Camera,
                title: "Upload Instagram Grid",
                desc: "Share their Instagram profile screenshot",
              },
              {
                icon: User,
                title: "Add Details",
                desc: "Tell us their age and interests",
              },
              {
                icon: DollarSign,
                title: "Set Budget",
                desc: "Choose your spending limit",
              },
              {
                icon: Sparkles,
                title: "Get Recommendations",
                desc: "Let our holiday elves work their magic!",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="relative p-6 rounded-xl border-2 border-holiday-green bg-white shadow-md hover:transform hover:-translate-y-1 transition-transform"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-holiday-red text-white rounded-full flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <div className="flex justify-center mb-4">
                  <step.icon className="w-12 h-12 text-holiday-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sample Profiles */}
        <section className="mb-16 p-8 border-2 border-dashed border-holiday-red rounded-xl relative">
          <span className="absolute -top-4 left-8 bg-white px-4 text-2xl flex items-center gap-2">
            <Heart className="w-6 h-6 text-holiday-red" />
            Sample Profiles
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Michelle",
                desc: "Art & Creativity Enthusiast",
                icon: Palette,
                img: "/samples/Michelle.png",
              },
              {
                name: "Nina",
                desc: "Fitness & Health Guru",
                icon: Dumbbell,
                img: "/samples/Nina.png",
              },
              {
                name: "Kareem",
                desc: "Tech & Gaming Pro",
                icon: Laptop,
                img: "/samples/Kareem.png",
              },
            ].map((profile) => (
              <div
                key={profile.name}
                className="bg-white rounded-xl p-4 shadow-md hover:transform hover:scale-105 transition-transform border-2 border-holiday-green group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <profile.icon className="w-6 h-6 text-holiday-gold" />
                  <h4 className="text-xl font-bold">{profile.name}</h4>
                </div>
                <p className="text-gray-600 mb-4">{profile.desc}</p>
                <div className="relative h-64 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow">
                  <Image
                    src={profile.img}
                    alt={`${profile.name}'s Instagram grid`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gift Finder Form */}
        <section className="mb-16 p-8 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl border-2 border-holiday-green">
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Gift className="w-8 h-8 text-holiday-red" />
            Find the Perfect Gift
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 flex items-center gap-2 text-lg font-medium">
                  <Instagram className="w-5 h-5 text-holiday-red" />
                  Instagram Grid Screenshot
                </label>
                <input
                  type="file"
                  name="instagram-grid"
                  onChange={handleImageUpload}
                  accept="image/*"
                  required
                  className="w-full p-3 border-2 border-holiday-green/30 rounded-lg focus:border-holiday-green focus:ring-2 focus:ring-holiday-green/20 transition-all"
                />
                {previewUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border-2 border-holiday-green">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 flex items-center gap-2 text-lg font-medium">
                    <Cake className="w-5 h-5 text-holiday-red" />
                    Gift Recipient's Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="1"
                    max="120"
                    className="w-full p-3 border-2 border-holiday-green/30 rounded-lg focus:border-holiday-green focus:ring-2 focus:ring-holiday-green/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 flex items-center gap-2 text-lg font-medium">
                    <Heart className="w-5 h-5 text-holiday-red" />
                    Interests & Personality (Optional)
                  </label>
                  <textarea
                    name="interests"
                    rows={3}
                    placeholder="e.g., photography, gaming, outdoor activities..."
                    className="w-full p-3 border-2 border-holiday-green/30 rounded-lg focus:border-holiday-green focus:ring-2 focus:ring-holiday-green/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 flex items-center gap-2 text-lg font-medium">
                    <Tag className="w-5 h-5 text-holiday-red" />
                    Holiday Budget
                  </label>
                  <input
                    type="number"
                    name="budget"
                    required
                    min="1"
                    className="w-full p-3 border-2 border-holiday-green/30 rounded-lg focus:border-holiday-green focus:ring-2 focus:ring-holiday-green/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 mt-8 bg-gradient-to-r from-holiday-red to-holiday-green text-white rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-6 h-6 animate-spin" />
                  Finding Perfect Gifts...
                </>
              ) : (
                <>
                  <Gift className="w-6 h-6" />
                  Find Perfect Holiday Gifts
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </section>

        {/* Gift Recommendations */}
        {recommendations.length > 0 && (
          <div id="results" className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-holiday-gold" />
              Perfect Holiday Gift Suggestions
              <Sparkles className="w-8 h-8 text-holiday-gold" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((gift, index) => (
                <div key={index} className="gift-card">
                  <div className="bg-gradient-to-r from-holiday-red to-holiday-green text-white p-4 rounded-t-lg">
                    <h3 className="font-bold text-xl">{gift.name}</h3>
                    <div className="text-holiday-gold text-2xl font-bold">
                      ${gift.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-b-lg border-2 border-t-0 border-holiday-green">
                    <p className="mb-4">{gift.description}</p>
                    <p className="text-gray-600 italic mb-4">
                      {gift.match_reason}
                    </p>
                    <div className="space-y-2">
                      {gift.amazon_link && (
                        <a
                          href={gift.amazon_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-[#232F3E] text-white rounded hover:bg-[#131921] transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          View on Amazon
                        </a>
                      )}
                      {gift.etsy_link && (
                        <a
                          href={gift.etsy_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-[#F1641E] text-white rounded hover:bg-[#D35400] transition-colors"
                        >
                          <ShoppingBag className="w-5 h-5" />
                          View on Etsy
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
