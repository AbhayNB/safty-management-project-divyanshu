from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from typing import List, Optional
from ..models import SafetyIncident
from ..schemas import SafetyIncidentCreate, SafetyIncidentUpdate

class SafetyIncidentService:
    def __init__(self, db: Session):
        self.db = db

    def create_incident(self, incident_data: SafetyIncidentCreate) -> SafetyIncident:
        try:
            db_incident = SafetyIncident(**incident_data.model_dump())
            self.db.add(db_incident)
            self.db.commit()
            self.db.refresh(db_incident)
            return db_incident
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error creating incident: {str(e)}")

    def get_incident(self, incident_id: int) -> SafetyIncident:
        incident = self.db.query(SafetyIncident).filter(SafetyIncident.incident_id == incident_id).first()
        if not incident:
            raise HTTPException(status_code=404, detail="Incident not found")
        return incident

    def get_incidents(self, skip: int = 0, limit: int = 100) -> List[SafetyIncident]:
        return self.db.query(SafetyIncident).offset(skip).limit(limit).all()

    def update_incident(self, incident_id: int, incident_data: SafetyIncidentUpdate) -> SafetyIncident:
        incident = self.get_incident(incident_id)
        try:
            update_data = incident_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(incident, field, value)
            self.db.commit()
            self.db.refresh(incident)
            return incident
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error updating incident: {str(e)}")

    def delete_incident(self, incident_id: int) -> bool:
        incident = self.get_incident(incident_id)
        try:
            self.db.delete(incident)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error deleting incident: {str(e)}")
