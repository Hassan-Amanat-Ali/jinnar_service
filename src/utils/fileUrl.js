/**
 * Constructs a full absolute URL from a relative path provided by the API.
 *
 * @param {string | undefined | null} relativeUrl - The relative URL from the database (e.g., "/api/files/gigImages/image.jpg").
 * @returns {string | undefined | null} The full image URL, or the original value if it's invalid or already an absolute URL.
 */
export const getFullImageUrl = (relativeUrl) => {
  if (!relativeUrl) return relativeUrl;

  // If it's already an absolute URL or blob url, return as-is
  const trimmed = String(relativeUrl).trim();
  if (trimmed.startsWith("http") || trimmed.startsWith("blob:")) return trimmed;

  const baseUrl = import.meta.env.VITE_BASE_URL;

  if (!baseUrl) {
    console.error(
      "VITE_BASE_URL is not defined. Please add it to your .env file to ensure images load correctly."
    );
    return trimmed;
  }

  // Combine the base URL and the relative path, ensuring no double slashes.
  return `${baseUrl.replace(/\/$/, "")}/${trimmed.replace(/^\//, "")}`;
};

/**
 * Converts coordinates to address using reverse geocoding
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string|null>} Address string or null if failed
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    // Use a free reverse geocoding service
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address");
    }

    const data = await response.json();

    // Return the formatted address
    return data.locality
      ? `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`
      : `${data.principalSubdivision}, ${data.countryName}`;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
};
