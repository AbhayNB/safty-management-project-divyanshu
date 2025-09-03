from sqlalchemy import Column, Integer, String, Date, DateTime, Time, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Location(Base):
    __tablename__ = "locations"
    
    location_id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String(100), nullable=False)
    
    # Relationships
    incidents = relationship("SafetyIncident", back_populates="location")
    inspections = relationship("SafetyInspection", back_populates="location")

class Employee(Base):
    __tablename__ = "employees"
    
    employee_id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String(100), nullable=False)
    employee_code = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(50))
    last_name = Column(String(50))
    department = Column(String(100))
    
    # Relationships
    training_participants = relationship("TrainingParticipant", back_populates="employee")
    ppe_compliance = relationship("PPECompliance", back_populates="employee")

class SafetyIncident(Base):
    __tablename__ = "safety_incidents"
    
    incident_id = Column(Integer, primary_key=True, index=True)
    date_time = Column(DateTime, nullable=False)
    location_id = Column(Integer, ForeignKey("locations.location_id"), nullable=False)
    incident_type = Column(String(100), nullable=False)
    description = Column(Text)
    injury_severity = Column(String(50))
    reporter_name = Column(String(100))
    status = Column(String(50), default="Open")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    location = relationship("Location", back_populates="incidents")

class SafetyTraining(Base):
    __tablename__ = "safety_trainings"
    
    training_id = Column(Integer, primary_key=True, index=True)
    training_type = Column(String(100), nullable=False)
    completion_date = Column(Date, nullable=False)
    expiry_date = Column(Date)
    trainer_name = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    participants = relationship("TrainingParticipant", back_populates="training")

class TrainingParticipant(Base):
    __tablename__ = "training_participants"
    
    id = Column(Integer, primary_key=True, index=True)
    training_id = Column(Integer, ForeignKey("safety_trainings.training_id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.employee_id"), nullable=False)
    
    # Relationships
    training = relationship("SafetyTraining", back_populates="participants")
    employee = relationship("Employee", back_populates="training_participants")

class SafetyInspection(Base):
    __tablename__ = "safety_inspections"
    
    inspection_id = Column(Integer, primary_key=True, index=True)
    inspection_type = Column(String(100), nullable=False)
    inspection_date = Column(Date, nullable=False)
    inspection_time = Column(Time)
    location_id = Column(Integer, ForeignKey("locations.location_id"), nullable=False)
    inspector_name = Column(String(100))
    notes = Column(Text)
    status = Column(String(50), default="Scheduled")
    score = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    location = relationship("Location", back_populates="inspections")

class PPECompliance(Base):
    __tablename__ = "ppe_compliance"
    
    ppe_id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id"), nullable=False)
    assessment_date = Column(Date)
    helmet_compliance = Column(Integer)
    safety_glasses_compliance = Column(Integer)
    gloves_compliance = Column(Integer)
    safety_shoes_compliance = Column(Integer)
    vest_compliance = Column(Integer)
    violations = Column(Integer, default=0)
    status = Column(String(50), default="Pending")
    assessor_name = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="ppe_compliance")
