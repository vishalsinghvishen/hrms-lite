from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Employee, Attendance, AttendanceStatus
from schemas import EmployeeCreate, EmployeeOut
from typing import List

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/", response_model=EmployeeOut, status_code=201)
def create_employee(emp: EmployeeCreate, db: Session = Depends(get_db)):
    # Check duplicate ID
    if db.query(Employee).filter(Employee.id == emp.id).first():
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    # Check duplicate email
    if db.query(Employee).filter(Employee.email == emp.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_emp = Employee(**emp.dict())
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return {**new_emp.__dict__, "total_present": 0}

@router.get("/", response_model=List[EmployeeOut])
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    result = []
    for emp in employees:
        total = db.query(Attendance).filter(
            Attendance.employee_id == emp.id,
            Attendance.status == AttendanceStatus.present
        ).count()
        result.append({**emp.__dict__, "total_present": total})
    return result

@router.delete("/{employee_id}", status_code=204)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(emp)
    db.commit()