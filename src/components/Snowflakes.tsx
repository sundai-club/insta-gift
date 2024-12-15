"use client";

import { useEffect } from "react";

export function createSnowflakes() {
  const snowflakes = 50;
  const container = document.getElementById("snowflakes");

  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < snowflakes; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.innerHTML = "❄";
    snowflake.style.left = `${Math.random() * 100}vw`;
    snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
    snowflake.style.opacity = Math.random().toString();
    snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;
    container.appendChild(snowflake);
  }
}

export default function Snowflakes() {
  useEffect(() => {
    createSnowflakes();
    return () => {
      const container = document.getElementById("snowflakes");
      if (container) container.innerHTML = "";
    };
  }, []);

  return null;
}
