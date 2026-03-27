import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "../lib/leafletIcons";

const hasValidCoordinates = (coordinates) =>
  Number.isFinite(coordinates?.lat) && Number.isFinite(coordinates?.lng);
const getGoogleMapsUrl = (coordinates) =>
  `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;

function ListingMap({ title, coordinates }) {
  if (!hasValidCoordinates(coordinates)) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Map
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
          See where this PG is located
        </h3>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(122,90,59,0.14)]">
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={15}
          scrollWheelZoom={false}
          className="h-[320px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lng]} />
        </MapContainer>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {title} is pinned using OpenStreetMap tiles at{" "}
          {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}.
        </p>
        <a
          href={getGoogleMapsUrl(coordinates)}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold"
        >
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}

export default ListingMap;
