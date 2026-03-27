import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      if (mode === "register" && form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (mode === "register") {
        await API.post("/api/auth/register", {
          email: form.email,
          password: form.password,
        });

        setSuccess("Account created. Signing you in...");
      }

      const res = await API.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          (mode === "register"
            ? "Registration failed. Please try again."
            : "Login failed. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setSuccess("");
    setForm({
      email: form.email,
      password: "",
      confirmPassword: "",
    });
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
              {mode === "login" ? "Welcome back" : "Create your admin account"}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {mode === "login" ? "Admin Login" : "Admin Register"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {mode === "login"
                ? "Sign in to manage properties, respond to requests, and keep listings fresh."
                : "Create the first admin account here. New accounts are signed in right away."}
            </p>

            <div className="mt-6 grid grid-cols-2 rounded-full bg-orange-100/70 p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Register
              </button>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="input-surface"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="input-surface"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              {mode === "register" ? (
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="input-surface"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
              ) : null}

              <button
                disabled={isSubmitting}
                className="btn-primary w-full px-4 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              >
                {isSubmitting
                  ? mode === "login"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "login"
                    ? "Login"
                    : "Create admin account"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-600">
              {mode === "login" ? "Need an admin account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(mode === "login" ? "register" : "login")}
                className="font-semibold text-orange-800 transition hover:text-orange-900"
              >
                {mode === "login" ? "Register here" : "Login here"}
              </button>
            </p>

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
