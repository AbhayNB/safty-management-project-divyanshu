from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from typing import List, Optional
from ..models import SafetyInspection, Location
from ..schemas import SafetyInspectionCreate, SafetyInspectionUpdate

class SafetyInspectionService:
    def __init__(self, db: Session):
        self.db = db

    def create_inspection(self, inspection_data: SafetyInspectionCreate) -> SafetyInspection:
        try:
            db_inspection = SafetyInspection(**inspection_data.model_dump())
            self.db.add(db_inspection)
            self.db.commit()
            self.db.refresh(db_inspection)
            return db_inspection
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error creating inspection: {str(e)}")

    def get_inspections(self, skip: int = 0, limit: int = 100) -> List[SafetyInspection]:
        return self.db.query(SafetyInspection).offset(skip).limit(limit).all()

    def get_inspection(self, inspection_id: int) -> Optional[SafetyInspection]:
        return self.db.query(SafetyInspection).filter(SafetyInspection.inspection_id == inspection_id).first()

    def update_inspection(self, inspection_id: int, inspection_data: SafetyInspectionUpdate) -> SafetyInspection:
        try:
            db_inspection = self.get_inspection(inspection_id)
            if not db_inspection:
                raise HTTPException(status_code=404, detail="Inspection not found")

            # Update fields
            update_data = inspection_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_inspection, field, value)

            self.db.commit()
            self.db.refresh(db_inspection)
            return db_inspection
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error updating inspection: {str(e)}")

    def delete_inspection(self, inspection_id: int) -> bool:
        try:
            db_inspection = self.get_inspection(inspection_id)
            if not db_inspection:
                return False

            self.db.delete(db_inspection)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error deleting inspection: {str(e)}")

# Simple service functions for backward compatibility
def get_inspections(db: Session, skip: int = 0, limit: int = 100) -> List:
    """Get inspections with pagination"""
    service = SafetyInspectionService(db)
    inspections = service.get_inspections(skip, limit)
    
    # Convert to dict format
    result = []
    for inspection in inspections:
        # Get location name
        location = db.query(Location).filter(Location.location_id == inspection.location_id).first()
        location_name = location.location_name if location else "Unknown"
        
        inspection_dict = {
            "inspection_id": inspection.inspection_id,
            "type": inspection.inspection_type,
            "area": location_name,
            "inspector": inspection.inspector_name,
            "scheduled_date": inspection.inspection_date.isoformat() if inspection.inspection_date else None,
            "completed_date": inspection.inspection_date.isoformat() if inspection.status == "Completed" else None,
            "status": inspection.status,
            "score": inspection.score,
            "notes": inspection.notes,
            "findings": []  # Can be extended later
        }
        result.append(inspection_dict)
    
    return result

def get_inspection_by_id(db: Session, inspection_id: int):
    """Get a specific inspection by ID"""
    service = SafetyInspectionService(db)
    inspection = service.get_inspection(inspection_id)
    
    if not inspection:
        return None
    
    # Get location name
    location = db.query(Location).filter(Location.location_id == inspection.location_id).first()
    location_name = location.location_name if location else "Unknown"
    
    return {
        "inspection_id": inspection.inspection_id,
        "type": inspection.inspection_type,
        "area": location_name,
        "inspector": inspection.inspector_name,
        "scheduled_date": inspection.inspection_date.isoformat() if inspection.inspection_date else None,
        "completed_date": inspection.inspection_date.isoformat() if inspection.status == "Completed" else None,
        "status": inspection.status,
        "score": inspection.score,
        "notes": inspection.notes,
        "findings": []
    }

def create_inspection(db: Session, inspection_data):
    """Create a new inspection"""
    service = SafetyInspectionService(db)
    
    # Convert dict to Pydantic model if needed
    if isinstance(inspection_data, dict):
        from ..schemas import SafetyInspectionCreate
        inspection_data = SafetyInspectionCreate(**inspection_data)
    
    inspection = service.create_inspection(inspection_data)
    
    # Get location name
    location = db.query(Location).filter(Location.location_id == inspection.location_id).first()
    location_name = location.location_name if location else "Unknown"
    
    return {
        "inspection_id": inspection.inspection_id,
        "type": inspection.inspection_type,
        "area": location_name,
        "inspector": inspection.inspector_name,
        "scheduled_date": inspection.inspection_date.isoformat() if inspection.inspection_date else None,
        "completed_date": None,
        "status": inspection.status,
        "score": inspection.score,
        "notes": inspection.notes,
        "findings": []
    }

def update_inspection(db: Session, inspection_id: int, inspection_data):
    """Update an existing inspection"""
    service = SafetyInspectionService(db)
    
    # Convert dict to Pydantic model if needed
    if isinstance(inspection_data, dict):
        from ..schemas import SafetyInspectionUpdate
        inspection_data = SafetyInspectionUpdate(**inspection_data)
    
    inspection = service.update_inspection(inspection_id, inspection_data)
    
    # Get location name
    location = db.query(Location).filter(Location.location_id == inspection.location_id).first()
    location_name = location.location_name if location else "Unknown"
    
    return {
        "inspection_id": inspection.inspection_id,
        "type": inspection.inspection_type,
        "area": location_name,
        "inspector": inspection.inspector_name,
        "scheduled_date": inspection.inspection_date.isoformat() if inspection.inspection_date else None,
        "completed_date": inspection.inspection_date.isoformat() if inspection.status == "Completed" else None,
        "status": inspection.status,
        "score": inspection.score,
        "notes": inspection.notes,
        "findings": []
    }

def delete_inspection(db: Session, inspection_id: int) -> bool:
    """Delete an inspection"""
    service = SafetyInspectionService(db)
    return service.delete_inspection(inspection_id)
