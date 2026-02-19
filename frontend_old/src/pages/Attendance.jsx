import { useEffect, useState } from "react";
import { getEmployees, getAttendance, markAttendance } from "../api/api";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [form, setForm] = useState({ employee_id: "", date: "", status: "Present" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    getEmployees().then((r) => setEmployees(r.data));
  }, []);

  const fetchRecords = (empId, date) => {
    if (!empId) return;
    setLoadingRecords(true);
    getAttendance(empId, date)
      .then((r) => setRecords(r.data))
      .finally(() => setLoadingRecords(false));
  };

  const handleEmpSelect = (empId) => {
    setSelectedEmp(empId);
    setRecords([]);
    setFilterDate("");
    fetchRecords(empId, "");
  };

  const handleFilter = () => fetchRecords(selectedEmp, filterDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);
    try {
      await markAttendance(form);
      setFormSuccess("Attendance marked successfully!");
      if (selectedEmp === form.employee_id) fetchRecords(selectedEmp, filterDate);
    } catch (err) {
      setFormError(err.response?.data?.detail || "Failed to mark attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
      status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
    }`}>
      {status}
    </span>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>

      {/* Mark Attendance Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Mark Attendance</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Employee</label>
            <select
              required
              value={form.employee_id}
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.full_name} ({e.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option>Present</option>
              <option>Absent</option>
            </select>
          </div>

          {formError && <p className="sm:col-span-3 text-red-500 text-sm">{formError}</p>}
          {formSuccess && <p className="sm:col-span-3 text-green-600 text-sm">{formSuccess}</p>}

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {submitting ? "Saving..." : "Mark Attendance"}
            </button>
          </div>
        </form>
      </div>

      {/* View Attendance Records */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-4">View Attendance Records</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={selectedEmp}
            onChange={(e) => handleEmpSelect(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.full_name} ({e.id})</option>
            ))}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={handleFilter}
            disabled={!selectedEmp}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 disabled:opacity-40 transition"
          >
            Filter
          </button>
          {filterDate && (
            <button
              onClick={() => { setFilterDate(""); fetchRecords(selectedEmp, ""); }}
              className="text-sm text-gray-500 hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {!selectedEmp ? (
          <p className="text-gray-400 text-sm text-center py-8">Select an employee to view records.</p>
        ) : loadingRecords ? (
          <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No attendance records found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                {["#", "Date", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((r, i) => (
                <tr key={r.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                  <td className="px-6 py-4 text-gray-700">{r.date}</td>
                  <td className="px-6 py-4">{statusBadge(r.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}




