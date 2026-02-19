from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import employees, attendance

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router)
app.include_router(attendance.router)

@app.get("/")
def root():
    return {"message": "HRMS Lite API is running"}


