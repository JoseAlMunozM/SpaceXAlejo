const API_URL = "https://1mvk749cn3.execute-api.us-east-1.amazonaws.com/prod/";

export async function fetchLaunches() {
  try {
    const response = await fetch(API_URL, { method: "GET" });
    if (!response.ok) throw new Error("Error en API");

    return await response.json();
  } catch (error) {
    console.error("Error fetching SpaceX data:", error);
    throw error;
  }
}
