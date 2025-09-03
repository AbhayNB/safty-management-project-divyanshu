from fastapi import APIRouter
from .incidents import router as incidents_router
from .training import router as training_router
from .inspections import router as inspections_router
from .ppe_compliance import router as ppe_compliance_router
from .locations import router as locations_router
from .employees import router as employees_router

api_router = APIRouter()

# Include all route modules
api_router.include_router(incidents_router)
api_router.include_router(training_router)
api_router.include_router(inspections_router)
api_router.include_router(ppe_compliance_router)
api_router.include_router(locations_router)
api_router.include_router(employees_router)
