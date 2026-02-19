//const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL = "https://hrms-lite-backend.onrender.com";



const api = {
  getEmployees: () => fetch(`${BASE_URL}/employees/`).then(r => r.json()),
  createEmployee: (data) => fetch(`${BASE_URL}/employees/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }),
  deleteEmployee: (id) => fetch(`${BASE_URL}/employees/${id}`, { method: "DELETE" }),
  getAttendance: (empId, date) => {
    const url = date
      ? `${BASE_URL}/attendance/${empId}?filter_date=${date}`
      : `${BASE_URL}/attendance/${empId}`;
    return fetch(url).then(r => r.json());
  },
  markAttendance: (data) => fetch(`${BASE_URL}/attendance/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }),
};