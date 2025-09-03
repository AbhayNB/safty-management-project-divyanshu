#!/usr/bin/env python3
"""
Database seeding script to add initial data for testing
"""
from datetime import datetime, date
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app.models import Base, Location, Employee, SafetyInspection, PPECompliance

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create a session
    db = SessionLocal()
    
    try:
        # Add Locations (only location_name field)
        locations_data = [
            {"location_name": "Main Factory Floor"},
            {"location_name": "Warehouse"},
            {"location_name": "Office Building"},
            {"location_name": "Loading Dock"},
            {"location_name": "Chemical Storage Room"}
        ]
        
        for loc_data in locations_data:
            # Check if location already exists
            existing = db.query(Location).filter(Location.location_name == loc_data["location_name"]).first()
            if not existing:
                location = Location(**loc_data)
                db.add(location)
        
        # Add Employees (only employee_name and employee_code)
        employees_data = [
            {"employee_name": "John Smith", "employee_code": "EMP001"},
            {"employee_name": "Sarah Johnson", "employee_code": "EMP002"},
            {"employee_name": "Mike Wilson", "employee_code": "EMP003"},
            {"employee_name": "Safety Officer Mike", "employee_code": "EMP004"},
            {"employee_name": "Safety Inspector Jane", "employee_code": "EMP005"}
        ]
        
        for emp_data in employees_data:
            # Check if employee already exists
            existing = db.query(Employee).filter(Employee.employee_code == emp_data["employee_code"]).first()
            if not existing:
                employee = Employee(**emp_data)
                db.add(employee)
        
        db.commit()
        
        # Now add some inspection data
        inspections_data = [
            {
                "inspection_type": "Monthly Safety Check",
                "inspection_date": date(2025, 9, 15),
                "location_id": 1,
                "inspector_name": "Safety Inspector Jane",
                "notes": "Routine monthly safety inspection",
                "status": "Scheduled"
            },
            {
                "inspection_type": "Fire Safety Inspection",
                "inspection_date": date(2025, 9, 1),
                "location_id": 2,
                "inspector_name": "Fire Safety Officer Mike",
                "notes": "Annual fire safety compliance check",
                "status": "Completed",
                "score": 92
            },
            {
                "inspection_type": "Equipment Safety Check",
                "inspection_date": date(2025, 8, 30),
                "location_id": 1,
                "inspector_name": "Equipment Specialist John",
                "notes": "Equipment safety verification",
                "status": "In Progress"
            }
        ]
        
        for insp_data in inspections_data:
            # Check if inspection already exists
            existing = db.query(SafetyInspection).filter(
                SafetyInspection.inspection_type == insp_data["inspection_type"],
                SafetyInspection.inspection_date == insp_data["inspection_date"]
            ).first()
            if not existing:
                inspection = SafetyInspection(**insp_data)
                db.add(inspection)
        
        # Add PPE Compliance data (employee-based)
        ppe_data = [
            {
                "employee_id": 1,
                "assessment_date": date(2025, 9, 1),
                "helmet_compliance": 95,
                "safety_glasses_compliance": 88,
                "gloves_compliance": 90,
                "safety_shoes_compliance": 98,
                "vest_compliance": 100,
                "violations": 1,
                "status": "Compliant",
                "assessor_name": "Safety Officer Jane"
            },
            {
                "employee_id": 2,
                "assessment_date": date(2025, 9, 2),
                "helmet_compliance": 100,
                "safety_glasses_compliance": 95,
                "gloves_compliance": 85,
                "safety_shoes_compliance": 100,
                "vest_compliance": 100,
                "violations": 0,
                "status": "Compliant",
                "assessor_name": "Safety Officer Jane"
            },
            {
                "employee_id": 3,
                "assessment_date": date(2025, 8, 30),
                "helmet_compliance": 80,
                "safety_glasses_compliance": 75,
                "gloves_compliance": 70,
                "safety_shoes_compliance": 85,
                "vest_compliance": 90,
                "violations": 3,
                "status": "Non-Compliant",
                "assessor_name": "Safety Officer Mike"
            }
        ]
        
        for ppe_record in ppe_data:
            # Check if PPE record already exists
            existing = db.query(PPECompliance).filter(
                PPECompliance.employee_id == ppe_record["employee_id"]
            ).first()
            if not existing:
                ppe = PPECompliance(**ppe_record)
                db.add(ppe)
        
        db.commit()
        print("✅ Database seeded successfully!")
        print(f"   Locations: {db.query(Location).count()}")
        print(f"   Employees: {db.query(Employee).count()}")
        print(f"   Inspections: {db.query(SafetyInspection).count()}")
        print(f"   PPE Records: {db.query(PPECompliance).count()}")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
