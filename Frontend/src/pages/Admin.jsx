import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import RatingStars from "../components/RatingStars";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [bookingsRes, pgsRes] = await Promise.all([
          API.get("/api/bookings"),
          API.get("/api/pgs"),
        ]);

        setBookings(bookingsRes.data);
        setPgs(pgsRes.data);
      } catch (err) {
        setError(
          err.response?.data?.msg ||
            err.response?.data?.error ||
            "Could not load dashboard data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setError("");
      await API.put(`/api/bookings/${id}`, { status });

      setBookings((current) =>
        current.map((booking) => (booking._id === id ? { ...booking, status } : booking)),
      );
    } catch (err) {
      setError(err.response?.data?.error || "Could not update booking status.");
    }
  };

  const toggleVerification = async (id, verifiedByAdmin) => {
    try {
      setError("");
      const res = await API.put(`/api/pgs/${id}/verify`, { verifiedByAdmin });

      setPgs((current) => current.map((pg) => (pg._id === id ? res.data : pg)));
    } catch (err) {
      setError(err.response?.data?.error || "Could not update verification status.");
    }
  };

  const deleteReview = async (pgId, reviewId) => {
    try {
      setError("");
      const res = await API.delete(`/api/pgs/${pgId}/reviews/${reviewId}`);

      setPgs((current) => current.map((pg) => (pg._id === pgId ? res.data : pg)));
    } catch (err) {
      setError(err.response?.data?.error || "Could not delete review.");
    }
  };

  const getAverageRating = (reviews = []) =>
    reviews.length
      ? (
          reviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

  const deletePG = async (id) => {
    try {
      setError("");
      await API.delete(`/api/pgs/${id}`);
      setPgs((current) => current.filter((pg) => pg._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Could not delete PG.");
    }
  };

  return (
    <div className="app-shell px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="glass-panel-strong page-enter flex flex-col gap-4 rounded-[2rem] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-800/70">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Manage bookings, listings, and review moderation from one responsive workspace.
            </h1>
          </div>
          <button
            onClick={() => navigate("/admin/add-pg")}
            className="btn-primary px-5 py-3 text-sm font-semibold"
          >
            + Add New PG
          </button>
        </div>

        {error ? (
          <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="glass-panel rounded-[2rem] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Bookings</h2>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {bookings.length} requests
            </span>
          </div>

          {isLoading ? (
            <div className="rounded-[1.5rem] bg-white/75 px-4 py-8 text-center text-slate-600">
              Loading dashboard data...
            </div>
          ) : null}

          {!isLoading && bookings.length === 0 ? (
            <div className="rounded-[1.5rem] bg-white/75 px-4 py-8 text-center text-slate-600">
              No booking requests yet.
            </div>
          ) : null}

          {!isLoading ? (
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200/80 text-sm text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">Name</th>
                    <th className="pb-3 pr-4 font-semibold">Phone</th>
                    <th className="pb-3 pr-4 font-semibold">PG</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b border-slate-200/60">
                      <td className="py-4 pr-4 font-medium text-slate-900">{b.name}</td>
                      <td className="py-4 pr-4 text-slate-600">{b.phone}</td>
                      <td className="py-4 pr-4 text-slate-600">{b.pg?.title}</td>
                      <td className="py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-800">
                            {b.status}
                          </span>
                          <button
                            onClick={() => updateStatus(b._id, "contacted")}
                            className="btn-secondary px-3 py-2 text-xs font-semibold"
                          >
                            Contacted
                          </button>
                          <button
                            onClick={() => updateStatus(b._id, "closed")}
                            className="btn-primary px-3 py-2 text-xs font-semibold"
                          >
                            Closed
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!isLoading ? (
            <div className="space-y-4 md:hidden">
              {bookings.map((b) => (
                <div key={b._id} className="rounded-[1.5rem] bg-white/75 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{b.name}</h3>
                      <p className="text-sm text-slate-500">{b.phone}</p>
                      <p className="mt-1 text-sm text-slate-600">{b.pg?.title}</p>
                    </div>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-800">
                      {b.status}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => updateStatus(b._id, "contacted")}
                      className="btn-secondary flex-1 px-3 py-2 text-xs font-semibold"
                    >
                      Contacted
                    </button>
                    <button
                      onClick={() => updateStatus(b._id, "closed")}
                      className="btn-primary flex-1 px-3 py-2 text-xs font-semibold"
                    >
                      Closed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="glass-panel rounded-[2rem] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Manage PGs</h2>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {pgs.length} listings
            </span>
          </div>

          <div className="grid gap-4">
            {!isLoading && pgs.length === 0 ? (
              <div className="rounded-[1.5rem] bg-white/75 px-4 py-8 text-center text-slate-600">
                No PG listings available.
              </div>
            ) : null}

            {pgs.map((pg) => (
              <div key={pg._id} className="rounded-[1.6rem] bg-white/75 p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{pg.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{pg.location}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                        {getAverageRating(pg.reviews) ? (
                          <span className="flex items-center gap-2">
                            <RatingStars
                              rating={Number(getAverageRating(pg.reviews))}
                              size="text-sm"
                            />
                            <span>{getAverageRating(pg.reviews)}</span>
                          </span>
                        ) : (
                          "No ratings yet"
                        )}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        {pg.reviews?.length || 0} comments
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                          pg.verifiedByAdmin
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {pg.verifiedByAdmin ? "Verified by Admin" : "Not Verified"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => toggleVerification(pg._id, !pg.verifiedByAdmin)}
                      className="btn-secondary px-4 py-2.5 text-sm font-semibold"
                    >
                      {pg.verifiedByAdmin ? "Remove Verification" : "Verify by Admin"}
                    </button>

                    <button
                      onClick={() => navigate(`/admin/edit-pg/${pg._id}`)}
                      className="btn-secondary px-4 py-2.5 text-sm font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deletePG(pg._id)}
                      className="btn-primary px-4 py-2.5 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.25rem] bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Comments
                    </h4>
                    <span className="text-xs text-slate-500">
                      Google-style stars shown from Nestify reviews
                    </span>
                  </div>

                  {pg.reviews?.length ? (
                    <div className="space-y-3">
                      {pg.reviews.map((review) => (
                        <div
                          key={review._id}
                          className="rounded-[1rem] bg-white px-4 py-4 shadow-sm"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h5 className="font-semibold text-slate-900">{review.name}</h5>
                                <RatingStars rating={review.rating} size="text-sm" />
                                <span className="text-xs font-medium text-slate-500">
                                  {review.rating}.0
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-500">
                                {new Date(review.createdAt).toLocaleDateString("en-IN")}
                              </p>
                              <p className="mt-3 text-sm leading-6 text-slate-600">
                                {review.comment}
                              </p>
                            </div>

                            <button
                              onClick={() => deleteReview(pg._id, review._id)}
                              className="btn-primary px-4 py-2 text-xs font-semibold"
                            >
                              Delete Comment
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[1rem] bg-white px-4 py-5 text-sm text-slate-600">
                      No comments to manage yet.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;
