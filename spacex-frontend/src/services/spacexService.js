const API_URL = "https://uz9jggkhf0.execute-api.us-east-1.amazonaws.com/prod/";

export async function fetchLaunches() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error("API error");
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching SpaceX data:", err);
    return null;
  }
}
