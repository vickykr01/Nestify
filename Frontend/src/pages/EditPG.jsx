import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function EditPG() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    facilities: "",
    gender: "boys",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPg = async () => {
      try {
        setIsLoading(true);
        setError("");

        const res = await API.get(`/api/pgs/${id}`);
        const pg = res.data;

        setForm({
          title: pg.title || "",
          location: pg.location || "",
          price: pg.price || "",
          facilities: pg.facilities?.join(", ") || "",
          gender: pg.gender || "boys",
        });
      } catch (err) {
        setError(err.response?.data?.error || "Could not load PG details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPg();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      await API.put(`/api/pgs/${id}`, form);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Could not update PG. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel rounded-[2rem] px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Loading PG details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell px-4 py-8 sm:px-6">
      <div className="glass-panel-strong page-enter mx-auto max-w-3xl rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-800/70">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Edit PG
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Fine-tune your listing with a cleaner, more comfortable editing flow.
        </p>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-surface sm:col-span-2"
            required
          />

          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="input-surface"
            required
          />

          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="input-surface"
            required
          />

          <input
            value={form.facilities}
            onChange={(e) => setForm({ ...form, facilities: e.target.value })}
            className="input-surface sm:col-span-2"
          />

          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="input-surface sm:col-span-2"
          >
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="both">Both</option>
          </select>

          <button
            disabled={isSubmitting}
            className="btn-primary sm:col-span-2 px-4 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Updating PG..." : "Update PG"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPG;
