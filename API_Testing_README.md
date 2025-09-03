# Safety Management API Testing Guide

This directory contains Postman collections and environments for testing the Safety Management System API.

## Files Included

1. **Safety_Management_API_Postman_Collection.json** - Main API collection with all endpoints
2. **Safety_Management_Development_Environment.json** - Development environment variables
3. **Safety_Management_API_Tests.json** - Automated test collection with assertions

## How to Use

### 1. Import into Postman

1. Open Postman
2. Click "Import" button
3. Import all three JSON files:
   - Main collection
   - Environment file
   - Test collection

### 2. Set Environment

1. In Postman, select "Safety Management Development" environment from the dropdown
2. Make sure your FastAPI server is running on `http://localhost:8000`

### 3. Test Individual Endpoints

Use the main collection to test individual endpoints:

#### Available Endpoint Categories:
- **Health Check** - Verify API is running
- **Incidents** - Create, read, update, delete incidents
- **Locations** - Manage facility locations
- **Employees** - Employee management
- **Safety Training** - Training session management
- **Safety Inspections** - Inspection scheduling and tracking
- **PPE Compliance** - Personal protective equipment compliance

### 4. Run Automated Tests

1. Select the "Safety Management API Tests" collection
2. Click "Run" to execute the test suite
3. View test results and assertions

## Environment Variables

The environment includes these pre-configured variables:

- `baseUrl`: http://localhost:8000
- `apiVersion`: v1
- `incidentId`: 1 (sample ID for testing)
- `trainingId`: 1 (sample ID for testing)
- `inspectionId`: 1 (sample ID for testing)
- `ppeId`: 1 (sample ID for testing)
- `locationId`: 1 (sample ID for testing)
- `employeeId`: 1 (sample ID for testing)

## Sample API Calls

### Create an Incident
```http
POST /api/v1/incidents
Content-Type: application/json

{
  "date_time": "2025-09-02T14:30:00",
  "location_id": 1,
  "incident_type": "Slip/Fall",
  "description": "Employee slipped on wet floor",
  "injury_severity": "Medium",
  "reporter_name": "John Smith",
  "status": "Open"
}
```

### Get All Incidents
```http
GET /api/v1/incidents?skip=0&limit=10
```

### Update Incident Status
```http
PUT /api/v1/incidents/1
Content-Type: application/json

{
  "status": "In Progress"
}
```

## Test Scenarios Covered

The automated test collection includes:

1. **API Health Check** - Verifies the API is accessible
2. **Create Incident** - Tests incident creation with validation
3. **Get Incident** - Retrieves and verifies incident data
4. **Update Incident** - Tests incident updates
5. **List Incidents** - Tests pagination and filtering
6. **Delete Incident** - Tests deletion with cleanup

## Expected Responses

### Successful Incident Creation (201)
```json
{
  "incident_id": 1,
  "date_time": "2025-09-02T14:30:00",
  "location_id": 1,
  "incident_type": "Slip/Fall",
  "description": "Employee slipped on wet floor",
  "injury_severity": "Medium",
  "reporter_name": "John Smith",
  "status": "Open",
  "created_at": "2025-09-02T14:30:00",
  "updated_at": "2025-09-02T14:30:00"
}
```

### Incident List Response (200)
```json
[
  {
    "incident_id": 1,
    "date_time": "2025-09-02T14:30:00",
    "location_id": 1,
    "incident_type": "Slip/Fall",
    "description": "Employee slipped on wet floor",
    "injury_severity": "Medium",
    "reporter_name": "John Smith",
    "status": "Open",
    "created_at": "2025-09-02T14:30:00",
    "updated_at": "2025-09-02T14:30:00"
  }
]
```

## Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `422` - Unprocessable Entity (invalid data)
- `500` - Internal Server Error

## Prerequisites

1. FastAPI backend server running on port 8000
2. Database properly configured and accessible
3. Postman installed (v10.0 or later recommended)

## Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Ensure FastAPI server is running: `python -m uvicorn main_new:app --reload`
   - Check if port 8000 is available

2. **404 Errors**
   - Verify the API routes are properly configured
   - Check the base URL in environment variables

3. **Validation Errors**
   - Review request body format
   - Ensure all required fields are included
   - Check data types match the schema

### Debug Mode

Enable verbose logging in FastAPI for detailed error information:
```bash
python -m uvicorn main_new:app --reload --log-level debug
```

## Contributing

When adding new endpoints:

1. Add the endpoint to the main collection
2. Include sample request/response data
3. Add corresponding test cases in the test collection
4. Update environment variables if needed
5. Document the new endpoint in this README

## Security Testing

For production environments:
- Test authentication mechanisms
- Validate input sanitization
- Check rate limiting
- Test CORS configuration
- Verify HTTPS redirects
