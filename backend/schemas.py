from pydantic import BaseModel, EmailStr
from datetime import date
from enum import Enum
from typing import List, Optional

class AttendanceStatus(str, Enum):
    present = "Present"
    absent = "Absent"

# Employee Schemas
class EmployeeCreate(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    department: str

class EmployeeOut(BaseModel):
    id: str
    full_name: str
    email: str
    department: str
    total_present: Optional[int] = 0

    class Config:
        from_attributes = True

# Attendance Schemas
class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: AttendanceStatus

class AttendanceOut(BaseModel):
    id: int
    employee_id: str
    date: date
    status: AttendanceStatus

    class Config:
        from_attributes = True