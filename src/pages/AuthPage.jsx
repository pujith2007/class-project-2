import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useFeedback } from "../context/FeedbackContext.jsx";
import { login, signup } from "../services/authService";
import { isFirebaseConfigured } from "../services/firebase.js";

export default function AuthPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useFeedback();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectTo = location.state?.from?.pathname || "/";

  if (isAuthenticated) return <Navigate to="/" replace />;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await signup(formData);
        showToast({
          tone: "success",
          title: "Account created",
          message: "Your study workspace is ready."
        });
      } else {
        await login(formData);
        showToast({
          tone: "success",
          title: "Welcome back",
          message: "Jumping into your dashboard now."
        });
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err.message.replace("Firebase: ", "");
      setError(message);
      showToast({
        tone: "error",
        title: "Authentication failed",
        message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-zinc-50 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="flex items-center px-5 py-10 md:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-emerald-600 text-white shadow-soft">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-zinc-950">StudyPulse AI</p>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Student command center</p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-sm font-bold text-emerald-700">{mode === "signup" ? "Create your space" : "Welcome back"}</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
              Study with a plan that adapts to you.
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Track topics, spot weak areas, and get focused recommendations before revision time slips away.
            </p>
            {!isFirebaseConfigured && (
              <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                Demo mode is active. You can sign up and test the app locally without Firebase keys.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 rounded-md border border-zinc-200 bg-white p-5 shadow-soft">
            <div className="grid grid-cols-2 rounded-md bg-zinc-100 p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-md px-3 py-2 text-sm font-bold transition ${mode === "login" ? "bg-white shadow-sm" : "text-zinc-500"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-md px-3 py-2 text-sm font-bold transition ${mode === "signup" ? "bg-white shadow-sm" : "text-zinc-500"}`}
              >
                Signup
              </button>
            </div>

            {mode === "signup" && (
              <label className="mt-5 block">
                <span className="text-sm font-bold text-zinc-700">Name</span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="focus-ring mt-2 w-full rounded-md border border-zinc-200 px-3 py-2.5 text-sm"
                  placeholder="Raghunandan"
                />
              </label>
            )}

            <label className="mt-5 block">
              <span className="text-sm font-bold text-zinc-700">Email</span>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="focus-ring mt-2 w-full rounded-md border border-zinc-200 px-3 py-2.5 text-sm"
                placeholder="student@example.com"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-bold text-zinc-700">Password</span>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="focus-ring mt-2 w-full rounded-md border border-zinc-200 px-3 py-2.5 text-sm"
                placeholder="Minimum 6 characters"
              />
            </label>

            {error && <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="focus-ring mt-5 w-full rounded-md bg-zinc-950 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}
            </button>
          </form>
        </div>
      </section>

      <section className="hidden min-h-screen bg-zinc-950 p-6 lg:block">
        <div
          className="h-full rounded-md bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(24,24,27,0.1), rgba(24,24,27,0.78)), url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1400&q=80')"
          }}
        >
          <div className="flex h-full flex-col justify-end p-10 text-white">
            <p className="max-w-md text-3xl font-extrabold tracking-tight">A calmer way to know exactly what to study next.</p>
            <div className="mt-6 grid max-w-lg grid-cols-3 gap-3">
              {["Weak areas", "Progress", "Revision"].map((item) => (
                <div key={item} className="rounded-md bg-white/12 px-3 py-3 text-sm font-bold backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
