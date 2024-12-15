"use client";

import { useState } from "react";
import Snowflakes from "@/components/Snowflakes";

interface GiftRecommendation {
  name: string;
  price: number;
  description: string;
  match_reason: string;
  amazon_link?: string;
  etsy_link?: string;
}

export default function GiftFinder() {
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
    <div className="min-h-screen bg-gradient-to-br from-holiday-red to-holiday-green p-4 relative">
      <Snowflakes />

      <div className="container max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 my-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <i className="fas fa-gifts text-holiday-gold"></i> Find the Perfect
            Gift
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div>
            <label className="block mb-2">
              <i className="fab fa-instagram"></i> Instagram Grid Screenshot
            </label>
            <input
              type="file"
              name="instagram-grid"
              onChange={handleImageUpload}
              accept="image/*"
              required
              className="w-full p-2 border rounded-lg"
            />
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2">
              <i className="fas fa-birthday-cake"></i> Gift Recipient's Age
            </label>
            <input
              type="number"
              name="age"
              required
              min="1"
              max="120"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">
              <i className="fas fa-heart"></i> Interests & Personality
            </label>
            <textarea
              name="interests"
              rows={3}
              required
              placeholder="e.g., photography, gaming, outdoor activities..."
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">
              <i className="fas fa-gift"></i> Holiday Budget
            </label>
            <input
              type="number"
              name="budget"
              required
              min="1"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-holiday-green text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Finding Perfect Gifts...
              </>
            ) : (
              <>
                <i className="fas fa-search mr-2"></i>
                Find Perfect Holiday Gifts
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {recommendations.length > 0 && (
          <div id="results" className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              🎄 Perfect Holiday Gift Suggestions 🎁
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
                          className="block w-full py-2 px-4 bg-[#232F3E] text-white text-center rounded hover:bg-[#131921] transition-colors"
                        >
                          <i className="fab fa-amazon mr-2"></i>
                          View on Amazon
                        </a>
                      )}
                      {gift.etsy_link && (
                        <a
                          href={gift.etsy_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-2 px-4 bg-[#F1641E] text-white text-center rounded hover:bg-[#D35400] transition-colors"
                        >
                          <i className="fab fa-etsy mr-2"></i>
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
