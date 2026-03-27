const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

const parseCoordinates = (item) => ({
  lat: Number.parseFloat(item.lat),
  lng: Number.parseFloat(item.lon ?? item.lng),
});

export async function searchLocation(query) {
  const searchParams = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "1",
    addressdetails: "1",
  });

  const response = await fetch(`${NOMINATIM_BASE_URL}/search?${searchParams.toString()}`, {
    headers: {
      "Accept-Language": "en",
    },
  });

  if (!response.ok) {
    throw new Error("Location search is unavailable right now.");
  }

  const results = await response.json();
  const match = results[0];

  if (!match) {
    return null;
  }

  return {
    label: match.display_name,
    ...parseCoordinates(match),
  };
}

export async function reverseGeocode(lat, lng) {
  const searchParams = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: "jsonv2",
  });

  const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${searchParams.toString()}`, {
    headers: {
      "Accept-Language": "en",
    },
  });

  if (!response.ok) {
    throw new Error("Reverse geocoding is unavailable right now.");
  }

  const result = await response.json();

  return {
    label: result.display_name,
    lat,
    lng,
  };
}
