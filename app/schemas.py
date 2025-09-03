from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, date, time

# Base schemas
class LocationBase(BaseModel):
    location_name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    building: Optional[str] = None
    floor: Optional[int] = None

class LocationCreate(LocationBase):
    pass

class LocationUpdate(BaseModel):
    location_name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    building: Optional[str] = None
    floor: Optional[int] = None

class LocationResponse(LocationBase):
    model_config = ConfigDict(from_attributes=True)
    location_id: int

# Employee schemas
class EmployeeBase(BaseModel):
    employee_name: str = Field(..., min_length=1, max_length=100)
    employee_code: str = Field(..., min_length=1, max_length=50)
    first_name: Optional[str] = Field(None, max_length=50)
    last_name: Optional[str] = Field(None, max_length=50)
    department: Optional[str] = Field(None, max_length=100)

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    employee_name: Optional[str] = Field(None, min_length=1, max_length=100)
    employee_code: Optional[str] = Field(None, min_length=1, max_length=50)
    first_name: Optional[str] = Field(None, max_length=50)
    last_name: Optional[str] = Field(None, max_length=50)
    department: Optional[str] = Field(None, max_length=100)

class EmployeeResponse(EmployeeBase):
    model_config = ConfigDict(from_attributes=True)
    employee_id: int

# Safety Incident schemas
class SafetyIncidentBase(BaseModel):
    date_time: datetime
    location_id: int
    incident_type: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    injury_severity: Optional[str] = None
    reporter_name: Optional[str] = None
    status: Optional[str] = "Open"

class SafetyIncidentCreate(SafetyIncidentBase):
    pass

class SafetyIncidentUpdate(BaseModel):
    date_time: Optional[datetime] = None
    location_id: Optional[int] = None
    incident_type: Optional[str] = None
    description: Optional[str] = None
    injury_severity: Optional[str] = None
    reporter_name: Optional[str] = None
    status: Optional[str] = None

class SafetyIncidentResponse(SafetyIncidentBase):
    model_config = ConfigDict(from_attributes=True)
    incident_id: int
    created_at: datetime
    updated_at: datetime

# Safety Training schemas
class SafetyTrainingBase(BaseModel):
    training_type: str = Field(..., min_length=1, max_length=100)
    completion_date: date
    expiry_date: Optional[date] = None
    trainer_name: Optional[str] = None

class SafetyTrainingCreate(SafetyTrainingBase):
    participants: Optional[List[int]] = []

class SafetyTrainingUpdate(BaseModel):
    training_type: Optional[str] = None
    completion_date: Optional[date] = None
    expiry_date: Optional[date] = None
    trainer_name: Optional[str] = None

class SafetyTrainingResponse(SafetyTrainingBase):
    model_config = ConfigDict(from_attributes=True)
    training_id: int
    created_at: datetime

# Safety Inspection schemas
class SafetyInspectionBase(BaseModel):
    inspection_type: str = Field(..., min_length=1, max_length=100)
    inspection_date: date
    inspection_time: Optional[time] = None
    location_id: int
    inspector_name: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = "Scheduled"
    score: Optional[int] = Field(None, ge=0, le=100)

class SafetyInspectionCreate(SafetyInspectionBase):
    pass

class SafetyInspectionUpdate(BaseModel):
    inspection_type: Optional[str] = None
    inspection_date: Optional[date] = None
    inspection_time: Optional[time] = None
    location_id: Optional[int] = None
    inspector_name: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None
    score: Optional[int] = Field(None, ge=0, le=100)

class SafetyInspectionResponse(SafetyInspectionBase):
    model_config = ConfigDict(from_attributes=True)
    inspection_id: int
    created_at: datetime

# PPE Compliance schemas
class PPEComplianceBase(BaseModel):
    employee_id: int
    assessment_date: Optional[date] = None
    helmet_compliance: Optional[int] = Field(None, ge=0, le=100)
    safety_glasses_compliance: Optional[int] = Field(None, ge=0, le=100)
    gloves_compliance: Optional[int] = Field(None, ge=0, le=100)
    safety_shoes_compliance: Optional[int] = Field(None, ge=0, le=100)
    vest_compliance: Optional[int] = Field(None, ge=0, le=100)
    violations: Optional[int] = Field(0, ge=0)
    status: Optional[str] = "Pending"
    assessor_name: Optional[str] = None

class PPEComplianceCreate(PPEComplianceBase):
    pass

class PPEComplianceUpdate(BaseModel):
    employee_id: Optional[int] = None
    assessment_date: Optional[date] = None
    helmet_compliance: Optional[int] = Field(None, ge=0, le=100)
    safety_glasses_compliance: Optional[int] = Field(None, ge=0, le=100)
    gloves_compliance: Optional[int] = Field(None, ge=0, le=100)
    safety_shoes_compliance: Optional[int] = Field(None, ge=0, le=100)
    vest_compliance: Optional[int] = Field(None, ge=0, le=100)
    violations: Optional[int] = Field(None, ge=0)
    status: Optional[str] = None
    assessor_name: Optional[str] = None

class PPEComplianceResponse(PPEComplianceBase):
    model_config = ConfigDict(from_attributes=True)
    ppe_id: int
    created_at: datetime
