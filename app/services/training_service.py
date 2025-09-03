from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from typing import List, Optional
from ..models import SafetyTraining, TrainingParticipant, Employee
from ..schemas import SafetyTrainingCreate, SafetyTrainingUpdate

class SafetyTrainingService:
    def __init__(self, db: Session):
        self.db = db

    def create_training(self, training_data: SafetyTrainingCreate) -> SafetyTraining:
        try:
            # Create the training session
            training_dict = training_data.model_dump()
            participants = training_dict.pop('participants', [])
            
            db_training = SafetyTraining(**training_dict)
            self.db.add(db_training)
            self.db.commit()
            self.db.refresh(db_training)

            # Add participants if provided
            if participants:
                for employee_id in participants:
                    participant = TrainingParticipant(
                        training_id=db_training.training_id,
                        employee_id=employee_id
                    )
                    self.db.add(participant)
                self.db.commit()

            return db_training
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error creating training: {str(e)}")

    def get_trainings(self, skip: int = 0, limit: int = 100) -> List[SafetyTraining]:
        return self.db.query(SafetyTraining).offset(skip).limit(limit).all()

    def get_training(self, training_id: int) -> Optional[SafetyTraining]:
        return self.db.query(SafetyTraining).filter(SafetyTraining.training_id == training_id).first()

    def update_training(self, training_id: int, training_data: SafetyTrainingUpdate) -> SafetyTraining:
        try:
            db_training = self.get_training(training_id)
            if not db_training:
                raise HTTPException(status_code=404, detail="Training not found")

            # Update fields
            update_data = training_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_training, field, value)

            self.db.commit()
            self.db.refresh(db_training)
            return db_training
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error updating training: {str(e)}")

    def delete_training(self, training_id: int) -> bool:
        try:
            db_training = self.get_training(training_id)
            if not db_training:
                return False

            # Delete participants first
            self.db.query(TrainingParticipant).filter(
                TrainingParticipant.training_id == training_id
            ).delete()
            
            # Delete training
            self.db.delete(db_training)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Error deleting training: {str(e)}")

# Simple service functions for backward compatibility
def get_trainings(db: Session, skip: int = 0, limit: int = 100) -> List:
    service = SafetyTrainingService(db)
    trainings = service.get_trainings(skip, limit)
    
    # Convert to dict format with participant count
    result = []
    for training in trainings:
        participant_count = db.query(TrainingParticipant).filter(
            TrainingParticipant.training_id == training.training_id
        ).count()
        
        training_dict = {
            "training_id": training.training_id,
            "training_type": training.training_type,
            "completion_date": training.completion_date.isoformat() if training.completion_date else None,
            "expiry_date": training.expiry_date.isoformat() if training.expiry_date else None,
            "trainer_name": training.trainer_name,
            "created_at": training.created_at.isoformat() if training.created_at else None,
            "participants_count": participant_count
        }
        result.append(training_dict)
    
    return result

def get_training_by_id(db: Session, training_id: int):
    service = SafetyTrainingService(db)
    training = service.get_training(training_id)
    
    if not training:
        return None
    
    participant_count = db.query(TrainingParticipant).filter(
        TrainingParticipant.training_id == training.training_id
    ).count()
    
    return {
        "training_id": training.training_id,
        "training_type": training.training_type,
        "completion_date": training.completion_date.isoformat() if training.completion_date else None,
        "expiry_date": training.expiry_date.isoformat() if training.expiry_date else None,
        "trainer_name": training.trainer_name,
        "created_at": training.created_at.isoformat() if training.created_at else None,
        "participants_count": participant_count
    }

def create_training(db: Session, training_data):
    service = SafetyTrainingService(db)
    
    # Convert dict to Pydantic model if needed
    if isinstance(training_data, dict):
        from ..schemas import SafetyTrainingCreate
        training_data = SafetyTrainingCreate(**training_data)
    
    training = service.create_training(training_data)
    
    return {
        "training_id": training.training_id,
        "training_type": training.training_type,
        "completion_date": training.completion_date.isoformat() if training.completion_date else None,
        "expiry_date": training.expiry_date.isoformat() if training.expiry_date else None,
        "trainer_name": training.trainer_name,
        "created_at": training.created_at.isoformat() if training.created_at else None,
        "participants_count": 0
    }

def update_training(db: Session, training_id: int, training_data):
    service = SafetyTrainingService(db)
    
    # Convert dict to Pydantic model if needed
    if isinstance(training_data, dict):
        from ..schemas import SafetyTrainingUpdate
        training_data = SafetyTrainingUpdate(**training_data)
    
    training = service.update_training(training_id, training_data)
    
    participant_count = db.query(TrainingParticipant).filter(
        TrainingParticipant.training_id == training.training_id
    ).count()
    
    return {
        "training_id": training.training_id,
        "training_type": training.training_type,
        "completion_date": training.completion_date.isoformat() if training.completion_date else None,
        "expiry_date": training.expiry_date.isoformat() if training.expiry_date else None,
        "trainer_name": training.trainer_name,
        "created_at": training.created_at.isoformat() if training.created_at else None,
        "participants_count": participant_count
    }

def delete_training(db: Session, training_id: int) -> bool:
    service = SafetyTrainingService(db)
    return service.delete_training(training_id)
