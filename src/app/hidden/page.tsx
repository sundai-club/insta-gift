"use client";

import { useState } from "react";
import Image from "next/image";
import { fetchInstagramData } from "@/utils/hidden/instagram";

interface GiftResult {
  name: string;
  price: number;
  description: string;
  matchReason: string;
  link: string;
  platform: "amazon" | "etsy";
}

export default function InstagramScraper() {
  const [activeInput, setActiveInput] = useState<
    "username" | "url" | "upload" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [giftResults, setGiftResults] = useState<GiftResult[]>([]);
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsLoading(true);

      if (activeInput === "username" && username) {
        const { posts, savedTo } = await fetchInstagramData(username);
        console.log("Instagram posts saved to:", savedTo);
      }
    } catch (error) {
      setError("Failed to fetch Instagram data. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-pink-100 to-purple-100 p-4 sm:p-8 relative overflow-hidden">
      {/* Snowflake Animation Container */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Add snowflake elements here if needed */}
      </div>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Instagram Data Scraper
        </h1>

        <div className="backdrop-blur-md bg-white/30 rounded-2xl p-6 sm:p-8 shadow-xl border border-white/50">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Instagram Data</h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Instagram username"
                  className="input-style"
                  disabled={activeInput && activeInput !== "username"}
                  onClick={() => setActiveInput("username")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <input
                  type="url"
                  placeholder="Instagram post URL"
                  className="input-style"
                  disabled={activeInput && activeInput !== "url"}
                  onClick={() => setActiveInput("url")}
                />
              </div>
              <div className="flex flex-col">
                <label className="input-style cursor-pointer text-gray-500">
                  <span>
                    {activeInput === "upload"
                      ? "Image selected"
                      : "Upload image"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={activeInput && activeInput !== "upload"}
                    onChange={() => setActiveInput("upload")}
                  />
                </label>
              </div>
            </div>
          </section>

          <button
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Fetch Instagram Data"}
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Fetching Instagram data...</p>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </main>
    </div>
  );
}
