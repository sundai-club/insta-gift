import fs from "fs/promises";
import path from "path";

interface InstagramPost {
  id: string;
  caption: string;
  likesCount: number;
  images: string[];
  timestamp: string;
  ownerUsername: string;
  hashtags: string[];
  mentions: string[];
  locationName: string | null;
}

export async function saveInstagramPost(
  username: string,
  posts: InstagramPost[]
) {
  try {
    // Create the base directory path
    const baseDir = path.join(process.cwd(), "data", username);

    // Ensure the directory exists
    await fs.mkdir(baseDir, { recursive: true });

    // Save posts data as JSON
    const postsPath = path.join(baseDir, "posts.json");
    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));

    // Create images directory
    const imagesDir = path.join(baseDir, "images");
    await fs.mkdir(imagesDir, { recursive: true });

    return { baseDir, imagesDir };
  } catch (error) {
    console.error("Error saving Instagram post:", error);
    throw error;
  }
}
