import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import ListingMap from "../components/ListingMap";
import RatingStars from "../components/RatingStars";
import { searchLocation } from "../lib/geocoding";

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
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const hasValidCoordinates =
    Number.isFinite(mapCoordinates?.lat) && Number.isFinite(mapCoordinates?.lng);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const averageRating = pg?.reviews?.length
    ? (
        pg.reviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
        pg.reviews.length
      ).toFixed(1)
    : null;

  useEffect(() => {
    const loadPg = async () => {
      try {
        setIsLoading(true);
        setError("");

        const res = await API.get(`/api/pgs/${id}`);
        const listing = res.data;
        setPg(listing);
        setMapCoordinates(listing.coordinates || null);
      } catch (err) {
        setError(err.response?.data?.error || "Could not load this listing.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPg();
  }, [id]);

  useEffect(() => {
    const loadFallbackCoordinates = async () => {
      if (!pg?.location || hasValidCoordinates) {
        return;
      }

      try {
        const result = await searchLocation(pg.location);

        if (result) {
          setMapCoordinates({
            lat: result.lat,
            lng: result.lng,
          });
        }
      } catch {
        // Keep the page usable even if geocoding is unavailable.
      }
    };

    loadFallbackCoordinates();
  }, [hasValidCoordinates, pg]);

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
      setError(err.response?.data?.error || "Could not send your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsReviewSubmitting(true);
      setReviewError("");
      setReviewSuccess("");

      const res = await API.post(`/api/pgs/${id}/reviews`, reviewForm);
      setPg(res.data);
      setReviewForm({
        name: "",
        rating: 5,
        comment: "",
      });
      setReviewSuccess("Thanks for sharing your rating and comment.");
    } catch (err) {
      setReviewError(err.response?.data?.error || "Could not submit your review.");
    } finally {
      setIsReviewSubmitting(false);
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

              <div className="mt-4 rounded-[1.5rem] bg-white/70 px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                    {averageRating ? (
                      <span className="flex items-center gap-2">
                        <RatingStars rating={Number(averageRating)} />
                        <span>{averageRating}</span>
                      </span>
                    ) : (
                      "No ratings yet"
                    )}
                  </span>
                  <span className="text-sm text-slate-600">
                    {pg.reviews?.length || 0} comments
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                      pg.verifiedByAdmin
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {pg.verifiedByAdmin ? "Verified by Admin" : "Pending Admin Verification"}
                  </span>
                </div>
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

              <ListingMap title={pg.title} coordinates={mapCoordinates} />

              <section className="mt-8 rounded-[1.5rem] bg-white/75 p-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Reviews
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                    5 star rating and comments
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Nestify shows ratings from reviews collected inside this app. Real Google
                    ratings would need a Google Places API key and separate integration.
                  </p>
                </div>

                <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
                  {reviewError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {reviewError}
                    </div>
                  ) : null}

                  {reviewSuccess ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {reviewSuccess}
                    </div>
                  ) : null}

                  <input
                    type="text"
                    placeholder="Your Name"
                    className="input-surface"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    required
                  />

                  <select
                    className="input-surface"
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
                    }
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>

                  <textarea
                    placeholder="Share your experience"
                    className="input-surface min-h-28 resize-none"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    required
                  />

                  <button
                    disabled={isReviewSubmitting}
                    className="btn-primary w-full px-6 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
                  >
                    {isReviewSubmitting ? "Submitting review..." : "Submit Review"}
                  </button>
                </form>

                <div className="mt-6 space-y-4">
                  {pg.reviews?.length ? (
                    pg.reviews.map((review, index) => (
                      <article
                        key={`${review.name}-${review.createdAt}-${index}`}
                        className="rounded-[1.25rem] bg-slate-50 px-4 py-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-slate-900">{review.name}</h4>
                            <p className="text-sm text-slate-500">
                              {new Date(review.createdAt).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                            <span className="flex items-center gap-2">
                              <RatingStars rating={review.rating} size="text-sm" />
                              <span>{review.rating}.0</span>
                            </span>
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                      No ratings or comments yet.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PgDetails;
