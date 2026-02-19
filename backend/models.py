from sqlalchemy import Column, String, Date, Enum, ForeignKey, Integer
from sqlalchemy.orm import relationship
from database import Base
import enum

class AttendanceStatus(str, enum.Enum):
    present = "Present"
    absent = "Absent"

class Employee(Base):
    __tablename__ = "employees"

    id = Column(String, primary_key=True, index=True)       # Employee ID
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)

    attendance = relationship("Attendance", back_populates="employee", cascade="all, delete")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(String, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(Enum(AttendanceStatus), nullable=False)

    employee = relationship("Employee", back_populates="attendance")