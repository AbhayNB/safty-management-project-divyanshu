from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.inspection_service import (
    get_inspections,
    get_inspection_by_id,
    create_inspection,
    update_inspection,
    delete_inspection
)
from app.schemas import SafetyInspectionCreate, SafetyInspectionUpdate
from typing import List

router = APIRouter(prefix="/inspections", tags=["inspections"])

@router.get("/")
async def get_inspection_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all inspections with pagination"""
    return get_inspections(db, skip, limit)

@router.get("/{inspection_id}")
async def get_inspection(inspection_id: int, db: Session = Depends(get_db)):
    """Get a specific inspection by ID"""
    inspection = get_inspection_by_id(db, inspection_id)
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return inspection

@router.post("/")
async def create_inspection_record(inspection_data: SafetyInspectionCreate, db: Session = Depends(get_db)):
    """Create a new inspection"""
    return create_inspection(db, inspection_data)

@router.put("/{inspection_id}")
async def update_inspection_record(
    inspection_id: int, 
    inspection_data: SafetyInspectionUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing inspection"""
    return update_inspection(db, inspection_id, inspection_data)

@router.delete("/{inspection_id}")
async def delete_inspection_record(inspection_id: int, db: Session = Depends(get_db)):
    """Delete an inspection"""
    success = delete_inspection(db, inspection_id)
    if not success:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return {"message": "Inspection deleted successfully"}
