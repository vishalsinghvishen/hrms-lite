import { useEffect, useState } from "react";
import { getEmployees } from "../api/api";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployees()
      .then((r) => setEmployees(r.data))
      .finally(() => setLoading(false));
  }, []);

  const totalPresent = employees.reduce((s, e) => s + (e.total_present || 0), 0);
  const departments = [...new Set(employees.map((e) => e.department))].length;

  if (loading) return <p className="text-center text-gray-500 mt-20">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Employees", value: employees.length, color: "bg-indigo-100 text-indigo-700" },
          { label: "Departments", value: departments, color: "bg-green-100 text-green-700" },
          { label: "Total Present Days", value: totalPresent, color: "bg-yellow-100 text-yellow-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-6 shadow-sm ${color}`}>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-4xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-700">Employee Overview</h2>
        </div>
        {employees.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No employees found. Add some!</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                {["ID", "Name", "Department", "Email", "Present Days"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-500">{e.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{e.full_name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full">
                      {e.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{e.email}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">{e.total_present}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}