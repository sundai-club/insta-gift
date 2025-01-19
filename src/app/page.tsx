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
    price?: number;
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
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 -top-24 bg-gradient-to-b from-pink-100/50 to-transparent via-pink-50/30 blur-3xl -z-10" />
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Define Your Style
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your fashion inspiration into a personalized style guide, powered by AI
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 text-pink-600/80 text-sm">
              <Sparkles className="w-5 h-5" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-pink-600/80 text-sm">
              <Palette className="w-5 h-5" />
              <span>Style Recommendations</span>
            </div>
            <div className="flex items-center gap-2 text-pink-600/80 text-sm">
              <ShoppingBag className="w-5 h-5" />
              <span>Curated Products</span>
            </div>
          </div>
        </div>

        {/* Sample Images Gallery */}
        <section className="mb-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">
            Example Instagram Grids
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload fashion influencer grid screenshots like these examples to get personalized style recommendations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              '/sample_images/IMG_4053.jpg',
              '/sample_images/IMG_4054.jpg',
              '/sample_images/IMG_5155.png'
            ].map((src, index) => (
              <div 
                key={index} 
                className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Image
                  src={src}
                  alt={`Sample Instagram grid ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    className="bg-pink-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-pink-700 transition-colors transform hover:scale-105 duration-200"
                    onClick={() => handleImageUpload(src)}
                  >
                    Try this example
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upload and Preferences Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-gray-800">
              <Upload className="w-6 h-6 text-pink-600" />
              Upload Instagram Grid
            </h2>
            
            <div className="space-y-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="block w-full cursor-pointer bg-pink-50/30 hover:bg-pink-100/30 text-pink-500 py-4 px-6 rounded-[24px] text-center transition-colors border border-dashed border-pink-300 hover:border-pink-400 shadow-sm"
              >
                Choose Screenshot
              </label>

              {!previewUrl && (
                <div className="mt-4 relative w-full">
                  <div className="bg-white rounded-[32px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="p-6">
                      <div className="text-gray-400/80 text-base mb-6 text-center">Instagram Grid Format</div>
                      <div className="grid grid-cols-3 gap-3">
                        {[...Array(9)].map((_, i) => (
                          <div 
                            key={i} 
                            className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gray-100 animate-pulse" />
                          </div>
                        ))}
                      </div>
                      <div className="text-gray-400/60 text-sm mt-6 text-center">
                        Take a screenshot of a fashion influencer's grid (3x3)
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {previewUrl && (
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-gray-800">
              <Tag className="w-6 h-6 text-pink-600" />
              Your Preferences
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Budget Range</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                >
                  <option value="budget">Budget-Friendly</option>
                  <option value="medium">Mid-Range</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              <button
                onClick={analyzeStyle}
                disabled={isLoading || !previewUrl}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg transform hover:translate-y-[-2px] active:translate-y-0 duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Style...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Style Recommendations
                  </span>
                )}
              </button>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-4 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3 text-gray-800">
              <Sparkles className="w-8 h-8 text-pink-600" />
              Your Style Recommendations
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-100 rounded-xl p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{rec.type}</h3>
                  <p className="text-gray-600 mb-4">
                    {rec.aesthetic}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {rec.color_palette.map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  
                  <div className="space-y-6">
                    {rec.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                        {item.image_url && (
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-800 mb-1">{item.name}</h4>
                          {item.price && (
                            <p className="text-pink-600 font-semibold mb-2">${item.price}</p>
                          )}
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <p className="text-gray-500 text-sm italic">{item.style_match}</p>
                          {item.shop_link && (
                            <a
                              href={item.shop_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-2 text-pink-600 hover:text-pink-700 font-medium text-sm"
                            >
                              <ShoppingBag className="w-4 h-4 mr-1" />
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
          </section>
        )}

        {/* How It Works Section */}
        <section className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-semibold mb-12 text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                <Grid className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Upload Instagram Grid</h3>
              <p className="text-gray-600">
                Share screenshots of your favorite fashion influencers
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes the style elements and aesthetic
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Get Recommendations</h3>
              <p className="text-gray-600">
                Receive personalized style and shopping suggestions
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
