"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Tag } from "lucide-react";

interface InstagramUploadProps {
  onUpload: (imageUrl: string, preferences: { budgetRange: string }) => void;
}

export default function InstagramUpload({ onUpload }: InstagramUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [budgetRange, setBudgetRange] = useState("Mid-Range");

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setPreviewUrl(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (previewUrl) {
      onUpload(previewUrl, { budgetRange });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Column - Upload */}
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Upload className="w-5 h-5 text-pink-500" />
          <h2 className="text-lg font-semibold">Upload Instagram Grid</h2>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-xl p-6 ${
            isDragging ? "border-pink-500 bg-pink-50" : "border-gray-200"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="text-center">
            <button className="mb-4 px-6 py-2 text-pink-500 border-2 border-pink-200 rounded-full hover:bg-pink-50 transition-colors">
              Choose Screenshot
            </button>
            
            {previewUrl ? (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-4">Instagram Grid Format</p>
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400">
                  Take a screenshot of a fashion influencer's grid (3x3)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Preferences */}
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Tag className="w-5 h-5 text-pink-500" />
          <h2 className="text-lg font-semibold">Your Preferences</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option>Budget-Friendly</option>
              <option>Mid-Range</option>
              <option>Luxury</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!previewUrl}
            className="w-full py-3 px-4 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Style Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}
