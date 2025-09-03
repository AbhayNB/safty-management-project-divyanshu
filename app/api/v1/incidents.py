from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ...database import get_db
from ...schemas import (
    SafetyIncidentCreate, 
    SafetyIncidentUpdate, 
    SafetyIncidentResponse
)
from ...services.incident_service import SafetyIncidentService

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.post("/", response_model=SafetyIncidentResponse, status_code=201)
def create_incident(
    incident_data: SafetyIncidentCreate,
    db: Session = Depends(get_db)
):
    """Create a new safety incident."""
    service = SafetyIncidentService(db)
    return service.create_incident(incident_data)

@router.get("/", response_model=List[SafetyIncidentResponse])
def list_incidents(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get all safety incidents with pagination."""
    service = SafetyIncidentService(db)
    return service.get_incidents(skip=skip, limit=limit)

@router.get("/{incident_id}", response_model=SafetyIncidentResponse)
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific safety incident by ID."""
    service = SafetyIncidentService(db)
    return service.get_incident(incident_id)

@router.put("/{incident_id}", response_model=SafetyIncidentResponse)
def update_incident(
    incident_id: int,
    incident_data: SafetyIncidentUpdate,
    db: Session = Depends(get_db)
):
    """Update a safety incident."""
    service = SafetyIncidentService(db)
    return service.update_incident(incident_id, incident_data)

@router.delete("/{incident_id}")
def delete_incident(
    incident_id: int,
    db: Session = Depends(get_db)
):
    """Delete a safety incident."""
    service = SafetyIncidentService(db)
    service.delete_incident(incident_id)
    return {"message": "Incident deleted successfully"}
