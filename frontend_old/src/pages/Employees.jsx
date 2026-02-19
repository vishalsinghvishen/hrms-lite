import { useEffect, useState } from "react";
import { getEmployees, createEmployee, deleteEmployee } from "../api/api";

const DEPARTMENTS = ["Engineering", "HR", "Finance", "Marketing", "Operations", "Design"];

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ id: "", full_name: "", email: "", department: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchEmployees = () => {
    setLoading(true);
    getEmployees()
      .then((r) => setEmployees(r.data))
      .catch(() => setError("Failed to load employees."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await createEmployee(form);
      setForm({ id: "", full_name: "", email: "", department: "" });
      fetchEmployees();
    } catch (err) {
      setFormError(err.response?.data?.detail || "Failed to add employee.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch {
      alert("Failed to delete employee.");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>

      {/* Add Employee Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Add New Employee</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "id", placeholder: "Employee ID", label: "Employee ID" },
            { name: "full_name", placeholder: "Full Name", label: "Full Name" },
            { name: "email", placeholder: "Email Address", label: "Email", type: "email" },
          ].map(({ name, placeholder, label, type = "text" }) => (
            <div key={name}>
              <label className="block text-xs text-gray-500 mb-1">{label}</label>
              <input
                type={type}
                required
                placeholder={placeholder}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Department</label>
            <select
              required
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          {formError && (
            <p className="sm:col-span-2 text-red-500 text-sm">{formError}</p>
          )}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {submitting ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-700">All Employees ({employees.length})</h2>
        </div>
        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-400 py-12">{error}</p>
        ) : employees.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No employees found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                {["ID", "Name", "Email", "Department", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-500">{e.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{e.full_name}</td>
                  <td className="px-6 py-4 text-gray-500">{e.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full">
                      {e.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}