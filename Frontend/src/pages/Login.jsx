import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="glass-panel hidden rounded-[2rem] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-800/70">
              Nestify Admin
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
              Manage bookings, listings, and follow-ups from one calmer workspace.
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
              The refreshed admin area is designed to feel lighter, quicker, and easier to use on
              both laptops and smaller screens.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            {["View bookings at a glance", "Edit listings faster", "Stay mobile-friendly"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/70 px-4 py-4 text-sm font-medium text-slate-700"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </section>

        <section className="glass-panel-strong page-enter rounded-[2rem] p-6 sm:p-8">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-800/70">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Admin Login
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Sign in to manage properties, respond to requests, and keep listings fresh.
            </p>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="input-surface"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="input-surface"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              <button
                disabled={isSubmitting}
                className="btn-primary w-full px-4 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <button
              onClick={() => navigate("/")}
              className="btn-secondary mt-4 w-full px-4 py-3 text-sm font-semibold"
            >
              Back to Home
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
