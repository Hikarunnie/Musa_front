const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch(
  endpoint: string,
  options?: RequestInit
) {
  const res = await fetch(`${API}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}