import requests
import json
from datetime import datetime

# Base URL for the API
BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_endpoint(method, endpoint, data=None, expected_status=200):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        
        print(f"{method} {endpoint}")
        print(f"Status Code: {response.status_code}")
        print(f"Expected: {expected_status}")
        
        if response.status_code == expected_status:
            print("✅ PASS")
        else:
            print("❌ FAIL")
            print(f"Response: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                if isinstance(data, list):
                    print(f"Returned {len(data)} items")
                elif isinstance(data, dict):
                    print(f"Returned: {list(data.keys())}")
            except:
                pass
        
        print("-" * 50)
        return response
        
    except requests.exceptions.ConnectionError:
        print(f"❌ CONNECTION ERROR: Could not connect to {url}")
        print("Make sure the API server is running on http://127.0.0.1:8000")
        print("-" * 50)
        return None
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        print("-" * 50)
        return None

def main():
    print("🧪 Testing Safety Management API Endpoints")
    print("=" * 60)
    
    # Test basic endpoints
    print("\n🔍 BASIC ENDPOINT TESTS")
    test_endpoint("GET", "/incidents/")
    test_endpoint("GET", "/training/")
    test_endpoint("GET", "/inspections/")
    test_endpoint("GET", "/ppe-compliance/")
    test_endpoint("GET", "/locations/")
    test_endpoint("GET", "/employees/")
    
    # Test creating new records
    print("\n📝 CREATE OPERATION TESTS")
    
    # Create a location first (needed for other tests)
    location_data = {
        "location_name": "Test Factory Floor"
    }
    location_response = test_endpoint("POST", "/locations/", location_data, 201)
    
    # Create an employee
    employee_data = {
        "employee_name": "Test Employee",
        "employee_code": "TEST001"
    }
    employee_response = test_endpoint("POST", "/employees/", employee_data, 201)
    
    # Create an incident
    incident_data = {
        "date_time": "2025-09-02T14:30:00",
        "location_id": 1,
        "incident_type": "Test Incident",
        "description": "This is a test incident",
        "injury_severity": "Low",
        "reporter_name": "Test Reporter",
        "status": "Open"
    }
    incident_response = test_endpoint("POST", "/incidents/", incident_data, 201)
    
    # Create a training session
    training_data = {
        "training_type": "Test Safety Training",
        "completion_date": "2025-09-02",
        "expiry_date": "2026-09-02",
        "trainer_name": "Test Trainer",
        "participants": [1, 2]
    }
    training_response = test_endpoint("POST", "/training/", training_data, 201)
    
    # Create an inspection
    inspection_data = {
        "inspection_type": "Test Inspection",
        "inspection_date": "2025-09-02",
        "inspection_time": "10:00:00",
        "location_id": 1,
        "inspector_name": "Test Inspector",
        "notes": "Test inspection notes",
        "status": "Scheduled"
    }
    inspection_response = test_endpoint("POST", "/inspections/", inspection_data, 201)
    
    # Create PPE compliance record
    ppe_data = {
        "location_id": 1,
        "equipment_type": "Test Hard Hat",
        "compliance_rate": 95,
        "violations": 2
    }
    ppe_response = test_endpoint("POST", "/ppe-compliance/", ppe_data, 201)
    
    # Test getting specific records by ID
    print("\n🔎 GET BY ID TESTS")
    test_endpoint("GET", "/incidents/1")
    test_endpoint("GET", "/training/1")
    test_endpoint("GET", "/inspections/1")
    test_endpoint("GET", "/ppe-compliance/1")
    
    # Test pagination
    print("\n📄 PAGINATION TESTS")
    test_endpoint("GET", "/incidents/?skip=0&limit=5")
    test_endpoint("GET", "/training/?skip=0&limit=5")
    
    print("\n✅ API testing completed!")
    print("If you see any FAIL messages above, check the API server logs.")

if __name__ == "__main__":
    main()
