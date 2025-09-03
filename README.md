# Safety Management System - Full Stack Application

A comprehensive safety management system with React frontend and FastAPI backend for managing workplace safety incidents, training, inspections, PPE compliance, locations, and employees.

## 🏗️ Project Structure

```
├── frontend/
│   └── safety-management-frontend/     # React frontend application
│       ├── src/
│       │   ├── components/            # React components for each module
│       │   │   ├── Dashboard/         # Main dashboard with charts
│       │   │   ├── Incidents/         # Incident management
│       │   │   ├── Training/          # Training sessions management
│       │   │   ├── Inspections/       # Safety inspections
│       │   │   ├── PPECompliance/     # PPE compliance tracking
│       │   │   └── common/            # Shared components
│       │   ├── services/              # API service layer
│       │   └── utils/                 # Utility functions
│       └── package.json
├── app/                               # Backend FastAPI application
│   ├── api/v1/                       # API endpoints (v1)
│   │   ├── incidents.py              # Incident management endpoints
│   │   ├── training.py               # Training management endpoints
│   │   ├── inspections.py            # Inspection management endpoints
│   │   ├── ppe_compliance.py         # PPE compliance endpoints
│   │   ├── locations.py              # Location management endpoints
│   │   └── employees.py              # Employee management endpoints
│   ├── services/                     # Business logic layer
│   │   ├── incident_service.py       # Incident business logic
│   │   ├── training_service.py       # Training business logic
│   │   ├── inspection_service.py     # Inspection business logic
│   │   ├── ppe_compliance_service.py # PPE compliance logic
│   │   ├── location_service.py       # Location management logic
│   │   └── employee_service.py       # Employee management logic
│   ├── models/                       # Database models
│   ├── schemas.py                    # Pydantic schemas
│   ├── database.py                   # Database configuration
│   └── config.py                     # Application configuration
├── main.py                           # FastAPI application entry point
├── requirements.txt                  # Python dependencies
├── safety.db                         # SQLite database
└── API testing files/
    ├── Safety_Management_API_Postman_Collection.json
    ├── Safety_Management_Environment.postman_environment.json
    ├── test_api_endpoints.py
    └── API_Testing_Summary.md
```

## ✨ Features

### 🚨 **Incident Management**
- Report and track safety incidents
- Categorize by severity and type
- Track investigation status
- Location-based incident reporting

### 📚 **Training Management**
- Schedule safety training sessions
- Track participant attendance
- Monitor training completion rates
- Set training expiry dates

### 🔍 **Safety Inspections**
- Schedule and conduct safety inspections
- Record inspection scores and findings
- Track compliance status
- Generate inspection reports

### 🦺 **PPE Compliance**
- Monitor personal protective equipment usage
- Track compliance rates by location
- Record violations and corrective actions
- Equipment-specific compliance tracking

### 📍 **Location Management**
- Manage facility locations
- Associate incidents with specific areas
- Track location-specific safety metrics

### 👥 **Employee Management**
- Maintain employee records
- Track safety training participation
- Associate employees with incidents and training

### 📊 **Dashboard & Analytics**
- Real-time safety metrics
- Interactive charts and graphs
- KPI tracking and reporting
- Trend analysis

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Python 3.9+
- npm or yarn

### Backend Setup

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Start the FastAPI server:**
```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

3. **API will be available at:**
- API: http://127.0.0.1:8000
- Interactive docs: http://127.0.0.1:8000/docs
- Alternative docs: http://127.0.0.1:8000/redoc

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend/safety-management-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the React development server:**
```bash
npm start
```

4. **Frontend will be available at:**
- React app: http://localhost:3000

## 🔌 API Endpoints

### Health Check
- `GET /` - API health check

### Incidents
- `GET /api/v1/incidents/` - List all incidents (with pagination)
- `POST /api/v1/incidents/` - Create new incident
- `GET /api/v1/incidents/{id}` - Get specific incident
- `PUT /api/v1/incidents/{id}` - Update incident
- `DELETE /api/v1/incidents/{id}` - Delete incident

### Training
- `GET /api/v1/training/` - List all training sessions
- `POST /api/v1/training/` - Create new training session
- `GET /api/v1/training/{id}` - Get specific training
- `PUT /api/v1/training/{id}` - Update training
- `DELETE /api/v1/training/{id}` - Delete training

### Inspections
- `GET /api/v1/inspections/` - List all inspections
- `POST /api/v1/inspections/` - Create new inspection
- `GET /api/v1/inspections/{id}` - Get specific inspection
- `PUT /api/v1/inspections/{id}` - Update inspection
- `DELETE /api/v1/inspections/{id}` - Delete inspection

### PPE Compliance
- `GET /api/v1/ppe-compliance/` - List all PPE records
- `POST /api/v1/ppe-compliance/` - Create new PPE record
- `GET /api/v1/ppe-compliance/{id}` - Get specific PPE record
- `PUT /api/v1/ppe-compliance/{id}` - Update PPE record
- `DELETE /api/v1/ppe-compliance/{id}` - Delete PPE record

### Locations
- `GET /api/v1/locations/` - List all locations
- `POST /api/v1/locations/` - Create new location
- `GET /api/v1/locations/{id}` - Get specific location
- `PUT /api/v1/locations/{id}` - Update location
- `DELETE /api/v1/locations/{id}` - Delete location

### Employees
- `GET /api/v1/employees/` - List all employees
- `POST /api/v1/employees/` - Create new employee
- `GET /api/v1/employees/{id}` - Get specific employee
- `PUT /api/v1/employees/{id}` - Update employee
- `DELETE /api/v1/employees/{id}` - Delete employee

## 🧪 Testing

### Automated Testing
Run the Python test script to validate all API endpoints:
```bash
python test_api_endpoints.py
```

### Postman Testing
1. Import `Safety_Management_API_Postman_Collection.json` into Postman
2. Import `Safety_Management_Environment.postman_environment.json` for environment variables
3. Run individual requests or the entire collection

### Interactive Testing
Visit http://127.0.0.1:8000/docs for FastAPI's automatic interactive documentation

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Material-UI** - Professional UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Chart.js/Recharts** - Data visualization
- **React Hook Form** - Form handling and validation

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **Pydantic** - Data validation and serialization
- **SQLite** - Database (easily replaceable with PostgreSQL/MySQL)
- **Uvicorn** - ASGI server

### Architecture Patterns
- **RESTful API design**
- **Service layer pattern**
- **Repository pattern**
- **Component-based frontend**
- **Separation of concerns**

## 📁 Key Files

### Configuration
- `main.py` - FastAPI application entry point
- `app/config.py` - Application configuration
- `app/database.py` - Database connection setup

### API Testing
- `Safety_Management_API_Postman_Collection.json` - Complete Postman collection
- `test_api_endpoints.py` - Automated API testing script
- `API_Testing_Summary.md` - Testing documentation

### Frontend Services
- `frontend/src/services/api.js` - API service layer
- `frontend/src/services/` - Module-specific API services

## 🔄 Development Workflow

1. **Backend Development:**
   - Modify services in `app/services/`
   - Update API endpoints in `app/api/v1/`
   - Test with `python test_api_endpoints.py`

2. **Frontend Development:**
   - Create/modify components in `frontend/src/components/`
   - Update API services in `frontend/src/services/`
   - Test in browser at http://localhost:3000

3. **Full Stack Testing:**
   - Start backend server
   - Start frontend server
   - Test integration between frontend and backend

## 🚀 Deployment

### Development
- Backend: `python -m uvicorn main:app --reload`
- Frontend: `npm start`

### Production
- Backend: `python -m uvicorn main:app --host 0.0.0.0 --port 8000`
- Frontend: `npm run build` → serve static files

## 📊 Current Status

✅ **Completed:**
- Complete React frontend with all modules
- Full FastAPI backend with all endpoints
- All CRUD operations working
- API testing infrastructure
- Mock data for development
- Responsive UI design
- Interactive dashboard

🔄 **In Progress:**
- Database schema finalization
- Real data integration

🎯 **Next Steps:**
- Replace mock data with persistent database
- Add user authentication
- Add role-based access control
- Production deployment
- Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Ready for development and testing!** 🎉
