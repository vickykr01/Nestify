import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import RatingStars from "../components/RatingStars";

const WHATSAPP_NUMBER = "6201373137";
const WHATSAPP_LINK = `https://wa.me/91${WHATSAPP_NUMBER}`;

function Home() {
  const [pgs, setPgs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactWarnings, setContactWarnings] = useState([]);
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const extractCityName = (location = "") => location.split(",")[0]?.trim() || location.trim();
  const cityOptions = [...new Set(pgs.map((pg) => extractCityName(pg.location)).filter(Boolean))].slice(
    0,
    8,
  );
  const filteredPgs = pgs.filter((pg) => {
    const query = searchQuery.trim().toLowerCase();
    const cityName = extractCityName(pg.location).toLowerCase();
    const cityMatches = !selectedCity || cityName === selectedCity.toLowerCase();

    if (!cityMatches) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [pg.title, pg.location, ...(pg.facilities || [])]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const formatPrice = (price) => `Rs. ${Number(price || 0).toLocaleString("en-IN")}`;
  const getAverageRating = (reviews = []) =>
    reviews.length
      ? (
          reviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

  useEffect(() => {
    API.get("/api/pgs")
      .then((res) => setPgs(res.data))
      .catch((err) => console.log(err));
  }, []);

  const scrollToContact = () => {
    const section = document.getElementById("contact");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToListings = () => {
    const section = document.getElementById("featured-pgs");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    scrollToListings();
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsContactSubmitting(true);
      setContactError("");
      setContactSuccess("");
      setContactWarnings([]);

      const res = await API.post("/api/contact", contactForm);
      setContactSuccess("Your contact request was submitted.");
      setContactWarnings(res.data.warnings || []);
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setContactError(
        err.response?.data?.error || "Could not send your contact request right now.",
      );
      setContactWarnings(err.response?.data?.warnings || []);
    } finally {
      setIsContactSubmitting(false);
    }
  };

  return (
    <div className="app-shell page-enter px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <div className="glass-panel-strong mx-auto flex max-w-7xl flex-col gap-4 rounded-[2rem] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-800/70">
            Nestify
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Find a polished place to stay.
          </h1>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:min-w-[320px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PG or city name"
              className="input-surface w-full pr-10 text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-orange-50 hover:text-orange-900"
            >
              Search
            </button>
          </form>

          <button
            onClick={scrollToContact}
            className="btn-secondary px-5 py-3 text-sm font-semibold"
          >
            Contact
          </button>

          {!token ? (
            <button
              onClick={() => navigate("/login")}
              className="btn-primary w-full px-5 py-3 text-sm font-semibold sm:w-auto"
            >
              Admin Login
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/admin")}
                className="btn-primary px-5 py-3 text-sm font-semibold"
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="btn-secondary px-5 py-3 text-sm font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      <section className="soft-grid mx-auto mt-6 grid max-w-7xl gap-6 overflow-hidden rounded-[2rem] border border-[rgba(122,90,59,0.12)] px-5 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-10 lg:py-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-900/70">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Modern stays, simplified
          </div>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Student and working-professional PG discovery with a warmer, cleaner vibe.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Browse comfortable spaces, compare locations quickly, and move from search to
            booking without the clutter.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                scrollToListings();
              }}
              className="btn-primary pulse-glow px-6 py-3.5 text-sm font-semibold sm:text-base"
            >
              Explore PGs
            </button>
            <button
              onClick={scrollToContact}
              className="btn-secondary px-6 py-3.5 text-sm font-semibold sm:text-base"
            >
              Contact Us
            </button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="glass-panel rounded-2xl px-4 py-4">
              <p className="text-3xl font-black text-slate-900">{pgs.length}+</p>
              <p className="mt-1 text-sm text-slate-600">Curated listings ready to explore</p>
            </div>
            <div className="glass-panel rounded-2xl px-4 py-4">
              <p className="text-3xl font-black text-slate-900">24/7</p>
              <p className="mt-1 text-sm text-slate-600">Easy browsing from any device</p>
            </div>
            <div className="glass-panel rounded-2xl px-4 py-4">
              <p className="text-3xl font-black text-slate-900">1 Tap</p>
              <p className="mt-1 text-sm text-slate-600">Fast booking requests for each property</p>
            </div>
          </div>
        </div>

        <div className="float-slow relative mx-auto w-full max-w-md">
          <div className="glass-panel-strong relative overflow-hidden rounded-[2rem] p-4 sm:p-5">
            <div className="absolute inset-x-5 top-5 h-28 rounded-[1.5rem] bg-gradient-to-r from-orange-200/70 via-amber-100/70 to-white/50 blur-2xl" />
            <div className="relative rounded-[1.6rem] bg-slate-900 p-5 text-white sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Featured City
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">Bengaluru Living</h3>
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs">
                  Move-in ready
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  "Mobile-first listing cards",
                  "Clean booking journey",
                  "Sharper admin navigation",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl" id="featured-pgs">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-800/70">
              Featured Stays
            </p>
            <h3 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Spaces that feel easy to choose on any screen.
            </h3>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600 sm:text-right">
            Cards now stack cleanly on mobile, expand on desktop, and use softer motion for a
            more modern first impression.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCity("");
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                searchQuery || selectedCity
                  ? "bg-white/70 text-slate-700"
                  : "bg-orange-100 text-orange-900"
              }`}
            >
              All Cities
            </button>
            {cityOptions.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  scrollToListings();
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCity.toLowerCase() === city.toLowerCase()
                    ? "bg-orange-100 text-orange-900"
                    : "bg-white/70 text-slate-700"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <p className="text-sm text-slate-600">
            {filteredPgs.length} result{filteredPgs.length === 1 ? "" : "s"}
            {searchQuery ? ` for "${searchQuery}"` : ""}
            {selectedCity ? `${searchQuery ? " in" : " for"} ${selectedCity}` : ""}
          </p>
        </div>

        {filteredPgs.length === 0 ? (
          <div className="glass-panel rounded-[2rem] px-6 py-12 text-center">
            <h4 className="text-2xl font-bold text-slate-900">No PGs found</h4>
            <p className="mt-3 text-slate-600">
              Try another PG name or city filter to see more listings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPgs.map((pg) => (
              <article
                key={pg._id}
                className="stagger-rise glass-panel group overflow-hidden rounded-[2rem]"
              >
                <div className="relative">
                  <img
                    src={pg.images?.[0] || "https://placehold.co/800x500?text=Nestify+PG"}
                    alt={pg.title}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                    {pg.gender || "PG"}
                  </div>
                  {pg.verifiedByAdmin ? (
                    <div className="absolute right-4 top-4 rounded-full bg-emerald-100/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
                      Verified by Admin
                    </div>
                  ) : null}
                </div>

                <div className="p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                      {getAverageRating(pg.reviews) ? (
                        <div className="flex items-center gap-2">
                          <RatingStars
                            rating={Number(getAverageRating(pg.reviews))}
                            size="text-sm"
                          />
                          <span>{getAverageRating(pg.reviews)}</span>
                        </div>
                      ) : (
                        "No ratings yet"
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {pg.reviews?.length || 0} comments
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-bold tracking-tight text-slate-900">
                        {pg.title}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500">{pg.location}</p>
                    </div>
                    <div className="rounded-2xl bg-orange-50 px-3 py-2 text-right">
                      <p className="text-xs uppercase tracking-[0.22em] text-orange-800/70">
                        Starting
                      </p>
                      <p className="text-sm font-bold text-orange-900">
                        {formatPrice(pg.price)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(pg.facilities || []).slice(0, 3).map((facility) => (
                      <span
                        key={facility}
                        className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(`/pg/${pg._id}`)}
                    className="btn-primary mt-6 w-full px-5 py-3 text-sm font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto mt-10 max-w-7xl" id="contact">
        <div className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-800/70">
                Contact
              </p>
              <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Reach Nestify in real time
              </h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Send your message here and Nestify can notify the team on WhatsApp and Gmail when
                the backend credentials are configured.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary inline-flex w-full items-center justify-center px-5 py-3 text-sm font-semibold"
                >
                  WhatsApp 6201373137
                </a>
                <button
                  onClick={() =>
                    window.open(
                      "https://mail.google.com/mail/?view=cm&fs=1&tf=1",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="btn-secondary w-full px-5 py-3 text-sm font-semibold"
                >
                  Open Gmail
                </button>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              {contactError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {contactError}
                </div>
              ) : null}

              {contactSuccess ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {contactSuccess}
                </div>
              ) : null}

              {contactWarnings.length ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {contactWarnings.join(" ")}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input-surface"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="input-surface"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Phone Number"
                className="input-surface"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              />

              <textarea
                placeholder="How can we help?"
                className="input-surface min-h-32 resize-none"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
              />

              <button
                disabled={isContactSubmitting}
                className="btn-primary w-full px-6 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              >
                {isContactSubmitting ? "Sending..." : "Send Contact Request"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
