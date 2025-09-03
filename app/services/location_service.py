from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from typing import List, Optional
from ..models import Location
from ..schemas import LocationCreate, LocationUpdate

class LocationService:
    def __init__(self, db: Session):
        self.db = db

    def create_location(self, location_data: LocationCreate) -> Location:
        try:
            db_location = Location(**location_data.model_dump())
            self.db.add(db_location)
            self.db.commit()
            self.db.refresh(db_location)
            return db_location
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error creating location: {str(e)}")

    def get_locations(self) -> List[Location]:
        return self.db.query(Location).all()

    def get_location(self, location_id: int) -> Optional[Location]:
        return self.db.query(Location).filter(Location.location_id == location_id).first()

    def update_location(self, location_id: int, location_data: LocationUpdate) -> Location:
        try:
            db_location = self.get_location(location_id)
            if not db_location:
                raise HTTPException(status_code=404, detail="Location not found")

            # Update fields
            update_data = location_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_location, field, value)

            self.db.commit()
            self.db.refresh(db_location)
            return db_location
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error updating location: {str(e)}")

    def delete_location(self, location_id: int) -> bool:
        try:
            db_location = self.get_location(location_id)
            if not db_location:
                return False

            self.db.delete(db_location)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error deleting location: {str(e)}")

# Simple service functions for backward compatibility
def get_locations(db: Session) -> List:
    """Get all locations"""
    service = LocationService(db)
    locations = service.get_locations()
    
    # Convert to dict format
    result = []
    for location in locations:
        location_dict = {
            "location_id": location.location_id,
            "name": location.location_name,
            "description": None,  # Not in database model
            "building": None,     # Not in database model
            "floor": None         # Not in database model
        }
        result.append(location_dict)
    
    return result

def get_location_by_id(db: Session, location_id: int):
    """Get a specific location by ID"""
    service = LocationService(db)
    location = service.get_location(location_id)
    
    if not location:
        return None
    
    return {
        "location_id": location.location_id,
        "name": location.location_name,
        "description": None,  # Not in database model
        "building": None,     # Not in database model
        "floor": None         # Not in database model
    }

def create_location(db: Session, location_data):
    """Create a new location"""
    service = LocationService(db)
    
    # Convert dict to Pydantic model if needed
    if isinstance(location_data, dict):
        from ..schemas import LocationCreate
        location_data = LocationCreate(**location_data)
    
    location = service.create_location(location_data)
    
    return {
        "location_id": location.location_id,
        "name": location.location_name,
        "description": None,  # Not in database model
        "building": None,     # Not in database model
        "floor": None         # Not in database model
    }

def update_location(db: Session, location_id: int, location_data):
    """Update an existing location"""
    service = LocationService(db)
    
    # Convert dict to Pydantic model if needed
    if isinstance(location_data, dict):
        from ..schemas import LocationUpdate
        location_data = LocationUpdate(**location_data)
    
    location = service.update_location(location_id, location_data)
    
    return {
        "location_id": location.location_id,
        "name": location.location_name,
        "description": None,  # Not in database model
        "building": None,     # Not in database model
        "floor": None         # Not in database model
    }

def delete_location(db: Session, location_id: int) -> bool:
    """Delete a location"""
    service = LocationService(db)
    return service.delete_location(location_id)
