import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center gap-8 shadow-md">
          <span className="text-xl font-bold tracking-wide">HRMS Lite</span>
          <div className="flex gap-6 text-sm font-medium">
            {[
              { to: "/", label: "Dashboard" },
              { to: "/employees", label: "Employees" },
              { to: "/attendance", label: "Attendance" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  isActive
                    ? "underline underline-offset-4"
                    : "hover:opacity-80 transition"
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Pages */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}