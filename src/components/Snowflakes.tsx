"use client";

import { useEffect } from "react";

export function createSnowflakes() {
  const snowflakes = 50;
  const container = document.getElementById("snowflakes");

  if (!container) return;

  container.innerHTML = "";

  // More detailed snowflake SVG pattern
  const snowflakeSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <!-- Main axes -->
      <line x1="12" y1="2" x2="12" y2="22"></line>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07"></line>
      
      <!-- Branch details -->
      <path d="M12 2 L14 6 L12 8 L10 6 L12 2"></path>
      <path d="M12 22 L14 18 L12 16 L10 18 L12 22"></path>
      <path d="M2 12 L6 14 L8 12 L6 10 L2 12"></path>
      <path d="M22 12 L18 14 L16 12 L18 10 L22 12"></path>
      <path d="M4.93 4.93 L7.76 7.76 L6.34 9.17 L4.93 7.76 L4.93 4.93"></path>
      <path d="M19.07 19.07 L16.24 16.24 L17.66 14.83 L19.07 16.24 L19.07 19.07"></path>
      <path d="M19.07 4.93 L16.24 7.76 L14.83 6.34 L16.24 4.93 L19.07 4.93"></path>
      <path d="M4.93 19.07 L7.76 16.24 L9.17 17.66 L7.76 19.07 L4.93 19.07"></path>
    </svg>
  `;

  for (let i = 0; i < snowflakes; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.innerHTML = snowflakeSvg;
    snowflake.style.left = `${Math.random() * 100}vw`;
    snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
    snowflake.style.opacity = (Math.random() * 0.4 + 0.3).toString();
    snowflake.style.transform = `scale(${Math.random() * 0.4 + 0.3})`; // Smaller sizes
    container.appendChild(snowflake);
  }
}

export default function Snowflakes() {
  useEffect(() => {
    createSnowflakes();
    const interval = setInterval(createSnowflakes, 5000);

    return () => {
      clearInterval(interval);
      const container = document.getElementById("snowflakes");
      if (container) container.innerHTML = "";
    };
  }, []);

  return null;
}
