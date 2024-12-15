"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-holiday-red to-holiday-green p-4 sm:p-8 relative overflow-hidden">
      {/* Snowflakes Animation Container */}
      <div className="absolute inset-0 pointer-events-none" id="snowflakes" />

      <div className="container max-w-6xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-holiday-red to-holiday-green bg-clip-text text-transparent">
            <span className="inline-block mx-2">🎁</span>
            InstaGift
            <span className="inline-block mx-2">🎁</span>
          </h1>
          <p className="text-xl text-gray-700">
            Discover the Perfect Holiday Gifts with AI Magic! 🎄✨
          </p>
        </header>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: "📸",
                title: "Upload Instagram Grid",
                desc: "Share their Instagram profile screenshot",
              },
              {
                icon: "👤",
                title: "Add Details",
                desc: "Tell us their age and interests",
              },
              {
                icon: "💰",
                title: "Set Budget",
                desc: "Choose your spending limit",
              },
              {
                icon: "✨",
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
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sample Grids */}
        <section className="mb-16 p-8 border-2 border-dashed border-holiday-red rounded-xl relative">
          <span className="absolute -top-4 left-8 bg-white px-4 text-2xl">
            🎄 Sample Profiles
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Michelle",
                desc: "Art & Creativity Enthusiast",
                emoji: "💕",
                img: "/samples/Michelle.png",
              },
              {
                name: "Nina",
                desc: "Fitness & Health Guru",
                emoji: "🏃‍♀️",
                img: "/samples/Nina.png",
              },
              {
                name: "Kareem",
                desc: "Tech & Gaming Pro",
                emoji: "💻",
                img: "/samples/Kareem.png",
              },
            ].map((profile) => (
              <div
                key={profile.name}
                className="bg-white rounded-xl p-4 shadow-md hover:transform hover:scale-105 transition-transform border-2 border-holiday-green"
              >
                <h4 className="text-xl font-bold mb-2">
                  {profile.emoji} {profile.name}
                </h4>
                <p className="text-gray-600 mb-4">{profile.desc}</p>
                <div className="relative h-64 rounded-lg overflow-hidden">
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

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/gifts"
            className="inline-block px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-holiday-red to-holiday-green rounded-full hover:opacity-90 transition-opacity shadow-lg"
          >
            Find the Perfect Gift Now 🎁
          </Link>
        </div>
      </div>
    </div>
  );
}
