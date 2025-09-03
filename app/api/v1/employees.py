from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.employee_service import (
    get_employees,
    get_employee_by_id,
    create_employee,
    update_employee,
    delete_employee
)
from app.schemas import EmployeeCreate, EmployeeUpdate
from typing import List

router = APIRouter(prefix="/employees", tags=["employees"])

@router.get("/")
async def get_employee_list(db: Session = Depends(get_db)):
    """Get all employees"""
    return get_employees(db)

@router.get("/{employee_id}")
async def get_employee(employee_id: int, db: Session = Depends(get_db)):
    """Get a specific employee by ID"""
    employee = get_employee_by_id(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("/")
async def create_employee_record(employee_data: EmployeeCreate, db: Session = Depends(get_db)):
    """Create a new employee"""
    return create_employee(db, employee_data)

@router.put("/{employee_id}")
async def update_employee_record(
    employee_id: int, 
    employee_data: EmployeeUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing employee"""
    return update_employee(db, employee_id, employee_data)

@router.delete("/{employee_id}")
async def delete_employee_record(employee_id: int, db: Session = Depends(get_db)):
    """Delete an employee"""
    success = delete_employee(db, employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}
