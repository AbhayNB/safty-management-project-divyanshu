from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from typing import List, Optional
from ..models import Employee
from ..schemas import EmployeeCreate, EmployeeUpdate

class EmployeeService:
    def __init__(self, db: Session):
        self.db = db

    def create_employee(self, employee_data: EmployeeCreate) -> Employee:
        try:
            db_employee = Employee(**employee_data.model_dump())
            self.db.add(db_employee)
            self.db.commit()
            self.db.refresh(db_employee)
            return db_employee
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error creating employee: {str(e)}")

    def get_employees(self) -> List[Employee]:
        return self.db.query(Employee).all()

    def get_employee(self, employee_id: int) -> Optional[Employee]:
        return self.db.query(Employee).filter(Employee.employee_id == employee_id).first()

    def update_employee(self, employee_id: int, employee_data: EmployeeUpdate) -> Employee:
        try:
            db_employee = self.get_employee(employee_id)
            if not db_employee:
                raise HTTPException(status_code=404, detail="Employee not found")

            # Update fields
            update_data = employee_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_employee, field, value)

            self.db.commit()
            self.db.refresh(db_employee)
            return db_employee
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error updating employee: {str(e)}")

    def delete_employee(self, employee_id: int) -> bool:
        try:
            db_employee = self.get_employee(employee_id)
            if not db_employee:
                return False

            self.db.delete(db_employee)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error deleting employee: {str(e)}")

# Simple service functions for backward compatibility
def get_employees(db: Session) -> List:
    """Get all employees"""
    service = EmployeeService(db)
    employees = service.get_employees()
    
    # Convert to dict format
    result = []
    for employee in employees:
        employee_dict = {
            "employee_id": employee.employee_id,
            "name": f"{employee.first_name} {employee.last_name}" if employee.first_name and employee.last_name else employee.employee_name,
            "employee_name": employee.employee_name,
            "employee_code": employee.employee_code,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "department": employee.department
        }
        result.append(employee_dict)
    
    return result

def get_employee_by_id(db: Session, employee_id: int):
    """Get a specific employee by ID"""
    service = EmployeeService(db)
    employee = service.get_employee(employee_id)
    
    if not employee:
        return None
    
    return {
        "employee_id": employee.employee_id,
        "name": f"{employee.first_name} {employee.last_name}" if employee.first_name and employee.last_name else employee.employee_name,
        "employee_name": employee.employee_name,
        "employee_code": employee.employee_code,
        "first_name": employee.first_name,
        "last_name": employee.last_name,
        "department": employee.department
    }

def create_employee(db: Session, employee_data):
    """Create a new employee"""
    service = EmployeeService(db)
    
    # Convert dict to Pydantic model if needed
    if isinstance(employee_data, dict):
        from ..schemas import EmployeeCreate
        employee_data = EmployeeCreate(**employee_data)
    
    employee = service.create_employee(employee_data)
    
    return {
        "employee_id": employee.employee_id,
        "name": f"{employee.first_name} {employee.last_name}" if employee.first_name and employee.last_name else employee.employee_name,
        "employee_name": employee.employee_name,
        "employee_code": employee.employee_code,
        "first_name": employee.first_name,
        "last_name": employee.last_name,
        "department": employee.department
    }

def update_employee(db: Session, employee_id: int, employee_data):
    """Update an existing employee"""
    service = EmployeeService(db)
    
    # Convert dict to Pydantic model if needed
    if isinstance(employee_data, dict):
        from ..schemas import EmployeeUpdate
        employee_data = EmployeeUpdate(**employee_data)
    
    employee = service.update_employee(employee_id, employee_data)
    
    return {
        "employee_id": employee.employee_id,
        "name": f"{employee.first_name} {employee.last_name}" if employee.first_name and employee.last_name else employee.employee_name,
        "employee_name": employee.employee_name,
        "employee_code": employee.employee_code,
        "first_name": employee.first_name,
        "last_name": employee.last_name,
        "department": employee.department
    }

def delete_employee(db: Session, employee_id: int) -> bool:
    """Delete an employee"""
    service = EmployeeService(db)
    return service.delete_employee(employee_id)
