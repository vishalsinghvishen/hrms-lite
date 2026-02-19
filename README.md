# HRMS Lite

A lightweight Human Resource Management System to manage employee records and track attendance.

## Tech Stack

- Frontend: HTML, CSS, Bootstrap 5
- Backend: FastAPI (Python)
- Database: SQLite (local)

## Local Setup

### Backend

1. Go to the backend folder

```
cd backend
```

2. Create a virtual environment

```
python -m venv venv
```

3. Activate the virtual environment

```
venv\Scripts\activate
```

4. Install dependencies

```
pip install -r requirements.txt
```

5. Create a `.env` file inside the `backend` folder with the following content

```
DATABASE_URL=sqlite:///./hrms.db
```

6. Run the backend server

```
uvicorn main:app --reload
```

Backend will be running at http://127.0.0.1:8000

### Frontend

1. Open `frontend/js/api.js` and make sure BASE_URL is set to

```
const BASE_URL = "http://127.0.0.1:8000";
```

2. Go to the frontend folder

```
cd frontend
```

3. Start a local server

```
python -m http.server 5500
```

4. Open your browser and go to

```
http://localhost:5500
```
