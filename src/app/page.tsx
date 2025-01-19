"use client";

import Image from "next/image";
import {
  Camera,
  User,
  DollarSign,
  Sparkles,
  Instagram,
  Heart,
  Palette,
  Tag,
  ShoppingBag,
  Share2,
  Bookmark,
  Grid,
  Upload,
  Search,
} from "lucide-react";
import { useState } from "react";
import { sampleStyles } from "@/data/examples";

interface StyleRecommendation {
  type: string;
  items: {
    name: string;
    price: number;
    description: string;
    style_match: string;
    image_url?: string;
    shop_link?: string;
  }[];
  aesthetic: string;
  color_palette: string[];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [budget, setBudget] = useState<string>("medium");
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement> | string) => {
    let imageUrl: string;
    
    if (typeof e === 'string') {
      // Handle direct image path
      imageUrl = e;
      setPreviewUrl(imageUrl);
      
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        setPreviewUrl(base64);
      } catch (error) {
        console.error('Error loading example image:', error);
        setError('Failed to load example image');
      }
    } else {
      // Handle file upload
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const analyzeStyle = async () => {
    if (!previewUrl) {
      setError("Please upload an Instagram grid screenshot first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-style", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: previewUrl,
          budget,
          preferences: stylePreferences,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze style");
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError("Failed to analyze style. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-pink-50 to-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-600">
          Insta-Fashion
        </h1>
        
        <p className="text-center text-lg mb-12">
          Discover your perfect style through Instagram inspiration
        </p>

        {/* Sample Images Gallery */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Example Instagram Grids</h2>
          <p className="text-center text-gray-600 mb-8">
            Upload fashion influencer grid screenshots like these examples to get personalized style recommendations
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              '/sample_images/3231E115-CC66-4924-A219-0EF6628F4F5F.png',
              '/sample_images/IMG_4053.jpg',
              '/sample_images/IMG_4054.jpg',
              '/sample_images/IMG_5155.png',
              '/sample_images/IMG_5156.png',
              '/sample_images/Screenshot_2025-01-19_at_2.06.23_PM.jpeg'
            ].map((src, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src={src}
                  alt={`Sample Instagram grid ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-pink-700 transition-colors"
                    onClick={() => handleImageUpload(src)}
                  >
                    Try this example
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Instagram Grid
            </h2>
            
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer bg-pink-100 hover:bg-pink-200 text-pink-600 font-semibold py-2 px-4 rounded-lg text-center transition-colors"
              >
                Choose Screenshot
              </label>
              
              {previewUrl && (
                <div className="relative w-full aspect-square">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Your Preferences
            </h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Budget Range</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="budget">Budget-Friendly</option>
                  <option value="medium">Mid-Range</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              <button
                onClick={analyzeStyle}
                disabled={isLoading || !previewUrl}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Analyzing..." : "Get Style Recommendations"}
              </button>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
            </div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-600" />
              Your Style Recommendations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{rec.type}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Aesthetic: {rec.aesthetic}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {rec.color_palette.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    {rec.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        {item.image_url && (
                          <div className="relative w-20 h-20">
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">${item.price}</p>
                          <p className="text-sm">{item.description}</p>
                          {item.shop_link && (
                            <a
                              href={item.shop_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                            >
                              Shop Now
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Grid className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="font-semibold mb-2">Upload Instagram Grid</h3>
              <p className="text-sm text-gray-600">
                Share screenshots of your favorite fashion influencers
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Search className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">
                Our AI analyzes the style elements and aesthetic
              </p>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="font-semibold mb-2">Get Recommendations</h3>
              <p className="text-sm text-gray-600">
                Receive personalized style and shopping suggestions
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
