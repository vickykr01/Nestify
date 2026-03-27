import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function PgDetails() {
  const { id } = useParams();
  const [pg, setPg] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPg = async () => {
      try {
        setIsLoading(true);
        setError("");

        const res = await API.get(`/api/pgs/${id}`);
        setPg(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Could not load this listing.");
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
      setSuccessMessage("");

      await API.post("/api/bookings", {
        ...form,
        pg: id,
      });

      setForm({
        name: "",
        phone: "",
        message: "",
      });
      setSuccessMessage("Request sent! We will contact you soon.");
    } catch (err) {
      setError(
        err.response?.data?.error || "Could not send your request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel rounded-[2rem] px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Loading listing...</h2>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel rounded-[2rem] px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Listing unavailable</h2>
          <p className="mt-3 text-sm text-slate-600">{error || "This PG could not be found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel-strong page-enter overflow-hidden rounded-[2rem]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[300px]">
              <img
                src={pg.images?.[0] || "https://placehold.co/1200x900?text=Nestify+PG"}
                alt={pg.title}
                className="h-full min-h-[300px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <div className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
                  {pg.gender || "PG Listing"}
                </div>
                <h1 className="mt-4 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {pg.title}
                </h1>
                <p className="mt-2 text-sm text-white/80 sm:text-base">{pg.location}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="rounded-[1.5rem] bg-orange-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-800/70">
                  Monthly Rent
                </p>
                <p className="mt-2 text-3xl font-black text-orange-950">
                  Rs. {Number(pg.price || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-900">Facilities</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pg.facilities?.map((facility, index) => (
                    <span
                      key={`${facility}-${index}`}
                      className="rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Request Booking
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                    Ask for a callback
                  </h2>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {successMessage}
                  </div>
                ) : null}

                <input
                  type="text"
                  placeholder="Your Name"
                  className="input-surface"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  className="input-surface"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />

                <textarea
                  placeholder="Message"
                  className="input-surface min-h-28 resize-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />

                <button
                  disabled={isSubmitting}
                  className="btn-primary w-full px-6 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
                >
                  {isSubmitting ? "Sending Request..." : "Request Booking"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PgDetails;
