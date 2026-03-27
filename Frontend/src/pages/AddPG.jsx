import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import MapPicker from "../components/MapPicker";

function AddPG() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    coordinates: {
      lat: null,
      lng: null,
    },
    price: "",
    facilities: "",
    gender: "boys",
    image: null,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasValidCoordinates =
    Number.isFinite(form.coordinates.lat) && Number.isFinite(form.coordinates.lng);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("location", form.location);
      if (hasValidCoordinates) {
        formData.append("lat", String(form.coordinates.lat));
        formData.append("lng", String(form.coordinates.lng));
      }
      formData.append("price", form.price);
      formData.append("facilities", form.facilities);
      formData.append("gender", form.gender);

      if (form.image) {
        formData.append("image", form.image);
      }

      await API.post("/api/pgs", formData);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Could not add PG. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell px-4 py-8 sm:px-6">
      <div className="glass-panel-strong page-enter mx-auto max-w-3xl rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-800/70">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Add New PG
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Create a listing that looks polished on desktop and mobile from the moment it goes live.
        </p>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Title"
            className="input-surface sm:col-span-2"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Location"
            className="input-surface"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Price"
            className="input-surface"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Facilities (comma separated)"
            className="input-surface sm:col-span-2"
            onChange={(e) => setForm({ ...form, facilities: e.target.value })}
          />

          <select
            className="input-surface"
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="both">Both</option>
          </select>

          <input
            type="file"
            className="input-surface"
            onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
          />

          <MapPicker
            location={form.location}
            coordinates={form.coordinates}
            onChange={(updates) =>
              setForm((current) => ({
                ...current,
                ...updates,
                coordinates: updates.coordinates || current.coordinates,
              }))
            }
          />

          <button
            disabled={isSubmitting}
            className="btn-primary sm:col-span-2 px-4 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Adding PG..." : "Add PG"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPG;
