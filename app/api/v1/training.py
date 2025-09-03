from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ...database import get_db
from ...schemas import (
    SafetyTrainingCreate, 
    SafetyTrainingUpdate, 
    SafetyTrainingResponse
)
from ...services.training_service import (
    get_trainings,
    get_training_by_id,
    create_training,
    update_training,
    delete_training
)

router = APIRouter(prefix="/training", tags=["training"])

@router.get("/")
async def get_training_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all training sessions with pagination"""
    return get_trainings(db, skip, limit)

@router.get("/{training_id}")
async def get_training_session(training_id: int, db: Session = Depends(get_db)):
    """Get a specific training session by ID"""
    training = get_training_by_id(db, training_id)
    if not training:
        raise HTTPException(status_code=404, detail="Training session not found")
    return training

@router.post("/", status_code=201)
async def create_training_session(
    training_data: SafetyTrainingCreate, 
    db: Session = Depends(get_db)
):
    """Create a new training session"""
    return create_training(db, training_data)

@router.put("/{training_id}")
async def update_training_session(
    training_id: int, 
    training_data: SafetyTrainingUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing training session"""
    return update_training(db, training_id, training_data)

@router.delete("/{training_id}")
async def delete_training_session(training_id: int, db: Session = Depends(get_db)):
    """Delete a training session"""
    success = delete_training(db, training_id)
    if not success:
        raise HTTPException(status_code=404, detail="Training session not found")
    return {"message": "Training session deleted successfully"}
