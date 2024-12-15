export async function fetchInstagramData(username: string, limit: number = 10) {
  try {
    const response = await fetch("/api/instagram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, limit }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram data");
    }

    const data = await response.json();
    return {
      posts: data.posts,
      savedTo: data.savedTo,
    };
  } catch (error) {
    console.error("Error fetching Instagram data:", error);
    throw error;
  }
}

export async function getSavedPosts(username: string) {
  try {
    const response = await fetch(`/api/posts/${username}`);

    if (!response.ok) {
      throw new Error("Failed to retrieve saved posts");
    }

    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.error("Error retrieving saved posts:", error);
    throw error;
  }
}
