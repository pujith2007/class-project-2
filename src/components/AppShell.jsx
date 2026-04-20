import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, BrainCircuit, LayoutDashboard, LogOut, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useFeedback } from "../context/FeedbackContext.jsx";
import { logout } from "../services/authService";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/topics", label: "Topics", icon: BarChart3 },
  { to: "/insights", label: "Insights", icon: Sparkles }
];

export default function AppShell() {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useFeedback();

  async function handleLogout() {
    try {
      await logout();
      showToast({
        tone: "success",
        title: "Logged out",
        message: "Your study data is safe and ready for your next session."
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Logout failed",
        message: error.message
      });
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-zinc-200 bg-white px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-emerald-600 text-white">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-extrabold tracking-tight">StudyPulse AI</p>
              <p className="text-xs font-medium text-zinc-500">Personal study intelligence</p>
            </div>
          </div>

          <nav className="mt-9 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-zinc-950 text-white shadow-soft"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-bold text-zinc-900">
              {currentUser?.displayName || currentUser?.email?.split("@")[0] || "Student"}
            </p>
            <p className="mt-1 truncate text-xs text-zinc-500">{currentUser?.email}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-zinc-700 shadow-sm transition hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-20 bg-zinc-950/30 lg:hidden"
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/85 px-4 py-3 backdrop-blur md:px-8 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="focus-ring rounded-md border border-zinc-200 bg-white p-2"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
