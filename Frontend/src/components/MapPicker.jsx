import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { reverseGeocode, searchLocation } from "../lib/geocoding";
import "../lib/leafletIcons";

const DEFAULT_CENTER = [12.9716, 77.5946];
const hasValidCoordinates = (coordinates) =>
  Number.isFinite(coordinates?.lat) && Number.isFinite(coordinates?.lng);
const getGoogleMapsUrl = (coordinates) =>
  `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;

function MapViewUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);

  return null;
}

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng);
    },
  });

  return null;
}

function MapPicker({ location, coordinates, onChange }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const mapCenter = hasValidCoordinates(coordinates)
    ? [coordinates.lat, coordinates.lng]
    : DEFAULT_CENTER;

  const handleCoordinateChange = (field, value) => {
    const parsed = value === "" ? null : Number.parseFloat(value);

    onChange({
      coordinates: {
        ...coordinates,
        [field]: Number.isFinite(parsed) ? parsed : null,
      },
    });
  };

  const handleSearch = async () => {
    const query = location.trim();

    if (!query) {
      setError("Enter an address or area name before searching.");
      setStatus("");
      return;
    }

    try {
      setIsSearching(true);
      setError("");
      setStatus("Finding this place on the map...");

      const result = await searchLocation(query);

      if (!result) {
        setError("No matching place was found. Try a fuller address.");
        setStatus("");
        return;
      }

      onChange({
        location: result.label,
        coordinates: {
          lat: result.lat,
          lng: result.lng,
        },
      });
      setStatus("Location pinned from Nominatim.");
    } catch (searchError) {
      setError(searchError.message || "Could not search this location.");
      setStatus("");
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapPick = async ({ lat, lng }) => {
    try {
      setIsReverseGeocoding(true);
      setError("");
      setStatus("Pin dropped. Looking up the nearest address...");

      const result = await reverseGeocode(lat, lng);

      onChange({
        location: result.label || location,
        coordinates: {
          lat: result.lat,
          lng: result.lng,
        },
      });
      setStatus("Map pin updated.");
    } catch (reverseError) {
      onChange({
        coordinates: {
          lat,
          lng,
        },
      });
      setError(reverseError.message || "Pin updated, but the address lookup failed.");
      setStatus("");
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Current location is not supported in this browser.");
      setStatus("");
      return;
    }

    setIsLocating(true);
    setError("");
    setStatus("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          setStatus("Current location found. Looking up the address...");

          const result = await reverseGeocode(latitude, longitude);

          onChange({
            location: result.label || location,
            coordinates: {
              lat: result.lat,
              lng: result.lng,
            },
          });
          setStatus("Current location applied.");
        } catch (reverseError) {
          onChange({
            coordinates: {
              lat: latitude,
              lng: longitude,
            },
          });
          setError(
            reverseError.message || "Coordinates were filled, but the address lookup failed.",
          );
          setStatus("");
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        const message =
          geoError.code === 1
            ? "Location permission was denied."
            : geoError.code === 2
              ? "Current location is unavailable."
              : "Location request timed out.";

        setError(message);
        setStatus("");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  return (
    <div className="sm:col-span-2">
      <div className="rounded-[1.5rem] border border-[rgba(122,90,59,0.14)] bg-white/55 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Map Location
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Search with Nominatim, use your current location, or click the map to place the
              listing pin.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isSearching || isReverseGeocoding || isLocating}
              className="btn-secondary px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLocating ? "Locating..." : "Use Current Location"}
            </button>
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching || isReverseGeocoding || isLocating}
              className="btn-secondary px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSearching ? "Searching..." : "Find on Map"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {status ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {status}
          </div>
        ) : null}

        <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-[rgba(122,90,59,0.14)]">
          <MapContainer
            center={mapCenter}
            zoom={coordinates?.lat && coordinates?.lng ? 15 : 11}
            scrollWheelZoom={false}
            className="h-[320px] w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapViewUpdater center={mapCenter} />
            <MapClickHandler onPick={handleMapPick} />
            {hasValidCoordinates(coordinates) ? (
              <Marker position={[coordinates.lat, coordinates.lng]} />
            ) : null}
          </MapContainer>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Latitude</span>
            <input
              type="number"
              step="any"
              value={coordinates?.lat ?? ""}
              onChange={(event) => handleCoordinateChange("lat", event.target.value)}
              className="input-surface bg-white"
              placeholder="12.971600"
            />
          </label>
          <label className="rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Longitude</span>
            <input
              type="number"
              step="any"
              value={coordinates?.lng ?? ""}
              onChange={(event) => handleCoordinateChange("lng", event.target.value)}
              className="input-surface bg-white"
              placeholder="77.594600"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            {hasValidCoordinates(coordinates)
              ? `Pinned at ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
              : "Set coordinates manually or drop a pin on the map."}
          </p>
          {hasValidCoordinates(coordinates) ? (
            <a
              href={getGoogleMapsUrl(coordinates)}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold"
            >
              Open in Google Maps
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MapPicker;
