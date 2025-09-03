from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from typing import List, Optional
from ..models import PPECompliance, Employee
from ..schemas import PPEComplianceCreate, PPEComplianceUpdate

class PPEComplianceService:
    def __init__(self, db: Session):
        self.db = db

    def create_ppe_compliance(self, ppe_data: PPEComplianceCreate) -> PPECompliance:
        try:
            db_ppe = PPECompliance(**ppe_data.model_dump())
            self.db.add(db_ppe)
            self.db.commit()
            self.db.refresh(db_ppe)
            return db_ppe
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error creating PPE compliance record: {str(e)}")

    def get_ppe_compliance_records(self, skip: int = 0, limit: int = 100) -> List[PPECompliance]:
        return self.db.query(PPECompliance).offset(skip).limit(limit).all()

    def get_ppe_compliance(self, ppe_id: int) -> Optional[PPECompliance]:
        return self.db.query(PPECompliance).filter(PPECompliance.ppe_id == ppe_id).first()

    def update_ppe_compliance(self, ppe_id: int, ppe_data: PPEComplianceUpdate) -> PPECompliance:
        try:
            db_ppe = self.get_ppe_compliance(ppe_id)
            if not db_ppe:
                raise HTTPException(status_code=404, detail="PPE compliance record not found")

            # Update fields
            update_data = ppe_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_ppe, field, value)

            self.db.commit()
            self.db.refresh(db_ppe)
            return db_ppe
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error updating PPE compliance record: {str(e)}")

    def delete_ppe_compliance(self, ppe_id: int) -> bool:
        try:
            db_ppe = self.get_ppe_compliance(ppe_id)
            if not db_ppe:
                return False

            self.db.delete(db_ppe)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error deleting PPE compliance record: {str(e)}")

# Simple service functions for backward compatibility
def get_ppe_compliance_records(db: Session, skip: int = 0, limit: int = 100) -> List:
    """Get PPE compliance records with pagination"""
    service = PPEComplianceService(db)
    records = service.get_ppe_compliance_records(skip, limit)
    
    # Convert to dict format
    result = []
    for record in records:
        # Get employee name
        employee = db.query(Employee).filter(Employee.employee_id == record.employee_id).first()
        employee_name = f"{employee.first_name} {employee.last_name}" if employee else "Unknown"
        
        record_dict = {
            "ppe_id": record.ppe_id,
            "employee": employee_name,
            "department": employee.department if employee else "Unknown",
            "assessment_date": record.assessment_date.isoformat() if record.assessment_date else None,
            "helmet_compliance": record.helmet_compliance,
            "safety_glasses_compliance": record.safety_glasses_compliance,
            "gloves_compliance": record.gloves_compliance,
            "safety_shoes_compliance": record.safety_shoes_compliance,
            "vest_compliance": record.vest_compliance,
            "violations": record.violations,
            "status": record.status,
            "assessor": record.assessor_name
        }
        result.append(record_dict)
    
    return result

def get_ppe_compliance_by_id(db: Session, ppe_id: int):
    """Get a specific PPE compliance record by ID"""
    service = PPEComplianceService(db)
    record = service.get_ppe_compliance(ppe_id)
    
    if not record:
        return None
    
    # Get employee name
    employee = db.query(Employee).filter(Employee.employee_id == record.employee_id).first()
    employee_name = f"{employee.first_name} {employee.last_name}" if employee else "Unknown"
    
    return {
        "ppe_id": record.ppe_id,
        "employee": employee_name,
        "department": employee.department if employee else "Unknown",
        "assessment_date": record.assessment_date.isoformat() if record.assessment_date else None,
        "helmet_compliance": record.helmet_compliance,
        "safety_glasses_compliance": record.safety_glasses_compliance,
        "gloves_compliance": record.gloves_compliance,
        "safety_shoes_compliance": record.safety_shoes_compliance,
        "vest_compliance": record.vest_compliance,
        "violations": record.violations,
        "status": record.status,
        "assessor": record.assessor_name
    }

def create_ppe_compliance(db: Session, ppe_data):
    """Create a new PPE compliance record"""
    service = PPEComplianceService(db)
    
    # Convert dict to Pydantic model if needed
    if isinstance(ppe_data, dict):
        from ..schemas import PPEComplianceCreate
        ppe_data = PPEComplianceCreate(**ppe_data)
    
    record = service.create_ppe_compliance(ppe_data)
    
    # Get employee name
    employee = db.query(Employee).filter(Employee.employee_id == record.employee_id).first()
    employee_name = f"{employee.first_name} {employee.last_name}" if employee else "Unknown"
    
    return {
        "ppe_id": record.ppe_id,
        "employee": employee_name,
        "department": employee.department if employee else "Unknown",
        "assessment_date": record.assessment_date.isoformat() if record.assessment_date else None,
        "helmet_compliance": record.helmet_compliance,
        "safety_glasses_compliance": record.safety_glasses_compliance,
        "gloves_compliance": record.gloves_compliance,
        "safety_shoes_compliance": record.safety_shoes_compliance,
        "vest_compliance": record.vest_compliance,
        "violations": record.violations,
        "status": record.status,
        "assessor": record.assessor_name
    }

def update_ppe_compliance(db: Session, ppe_id: int, ppe_data):
    """Update an existing PPE compliance record"""
    service = PPEComplianceService(db)
    
    # Convert dict to Pydantic model if needed
    if isinstance(ppe_data, dict):
        from ..schemas import PPEComplianceUpdate
        ppe_data = PPEComplianceUpdate(**ppe_data)
    
    record = service.update_ppe_compliance(ppe_id, ppe_data)
    
    # Get employee name
    employee = db.query(Employee).filter(Employee.employee_id == record.employee_id).first()
    employee_name = f"{employee.first_name} {employee.last_name}" if employee else "Unknown"
    
    return {
        "ppe_id": record.ppe_id,
        "employee": employee_name,
        "department": employee.department if employee else "Unknown",
        "assessment_date": record.assessment_date.isoformat() if record.assessment_date else None,
        "helmet_compliance": record.helmet_compliance,
        "safety_glasses_compliance": record.safety_glasses_compliance,
        "gloves_compliance": record.gloves_compliance,
        "safety_shoes_compliance": record.safety_shoes_compliance,
        "vest_compliance": record.vest_compliance,
        "violations": record.violations,
        "status": record.status,
        "assessor": record.assessor_name
    }

def delete_ppe_compliance(db: Session, ppe_id: int) -> bool:
    """Delete a PPE compliance record"""
    service = PPEComplianceService(db)
    return service.delete_ppe_compliance(ppe_id)
