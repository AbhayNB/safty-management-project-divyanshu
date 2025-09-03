from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.ppe_compliance_service import (
    get_ppe_compliance_records,
    get_ppe_compliance_by_id,
    create_ppe_compliance,
    update_ppe_compliance,
    delete_ppe_compliance
)
from app.schemas import PPEComplianceCreate, PPEComplianceUpdate
from typing import List

router = APIRouter(prefix="/ppe-compliance", tags=["ppe-compliance"])

@router.get("/")
async def get_ppe_compliance_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all PPE compliance records with pagination"""
    return get_ppe_compliance_records(db, skip, limit)

@router.get("/{ppe_id}")
async def get_ppe_compliance_record(ppe_id: int, db: Session = Depends(get_db)):
    """Get a specific PPE compliance record by ID"""
    record = get_ppe_compliance_by_id(db, ppe_id)
    if not record:
        raise HTTPException(status_code=404, detail="PPE compliance record not found")
    return record

@router.post("/")
async def create_ppe_compliance_record(ppe_data: PPEComplianceCreate, db: Session = Depends(get_db)):
    """Create a new PPE compliance record"""
    return create_ppe_compliance(db, ppe_data)

@router.put("/{ppe_id}")
async def update_ppe_compliance_record(
    ppe_id: int, 
    ppe_data: PPEComplianceUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing PPE compliance record"""
    return update_ppe_compliance(db, ppe_id, ppe_data)

@router.delete("/{ppe_id}")
async def delete_ppe_compliance_record(ppe_id: int, db: Session = Depends(get_db)):
    """Delete a PPE compliance record"""
    success = delete_ppe_compliance(db, ppe_id)
    if not success:
        raise HTTPException(status_code=404, detail="PPE compliance record not found")
    return {"message": "PPE compliance record deleted successfully"}
