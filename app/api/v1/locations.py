from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.location_service import (
    get_locations,
    get_location_by_id,
    create_location,
    update_location,
    delete_location
)
from app.schemas import LocationCreate, LocationUpdate
from typing import List

router = APIRouter(prefix="/locations", tags=["locations"])

@router.get("/")
async def get_location_list(db: Session = Depends(get_db)):
    """Get all locations"""
    return get_locations(db)

@router.get("/{location_id}")
async def get_location(location_id: int, db: Session = Depends(get_db)):
    """Get a specific location by ID"""
    location = get_location_by_id(db, location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location

@router.post("/")
async def create_location_record(location_data: LocationCreate, db: Session = Depends(get_db)):
    """Create a new location"""
    return create_location(db, location_data)

@router.put("/{location_id}")
async def update_location_record(
    location_id: int, 
    location_data: LocationUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing location"""
    return update_location(db, location_id, location_data)

@router.delete("/{location_id}")
async def delete_location_record(location_id: int, db: Session = Depends(get_db)):
    """Delete a location"""
    success = delete_location(db, location_id)
    if not success:
        raise HTTPException(status_code=404, detail="Location not found")
    return {"message": "Location deleted successfully"}
