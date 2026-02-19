from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Attendance, Employee
from schemas import AttendanceCreate, AttendanceOut
from typing import List, Optional
from datetime import date

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/", response_model=AttendanceOut, status_code=201)
def mark_attendance(att: AttendanceCreate, db: Session = Depends(get_db)):
    # Validate employee exists
    emp = db.query(Employee).filter(Employee.id == att.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check duplicate attendance for same date
    existing = db.query(Attendance).filter(
        Attendance.employee_id == att.employee_id,
        Attendance.date == att.date
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")
    
    new_att = Attendance(**att.dict())
    db.add(new_att)
    db.commit()
    db.refresh(new_att)
    return new_att

@router.get("/{employee_id}", response_model=List[AttendanceOut])
def get_attendance(
    employee_id: str,
    filter_date: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    if filter_date:
        query = query.filter(Attendance.date == filter_date)
    
    return query.order_by(Attendance.date.desc()).all()