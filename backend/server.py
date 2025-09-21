from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Portfolio Models
class ProfileData(BaseModel):
    name: str
    title: str
    company: str
    location: str
    tagline: str
    summary: str
    contact: Dict[str, Any]

class Skill(BaseModel):
    name: str
    level: int
    category: str

class Certification(BaseModel):
    id: int
    name: str
    issuer: str
    year: str
    type: str

class Experience(BaseModel):
    id: int
    company: str
    position: str
    duration: str
    period: str
    description: str
    technologies: List[str]

class Project(BaseModel):
    id: int
    title: str
    description: str
    technologies: List[str]
    status: str
    impact: str

class Education(BaseModel):
    degree: str
    institution: str
    duration: str
    description: str

class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="new")

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    message: str

class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Portfolio API Endpoints
@api_router.get("/profile", response_model=APIResponse)
async def get_profile():
    try:
        profile = await db.profiles.find_one()
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Remove MongoDB _id field
        profile.pop('_id', None)
        return APIResponse(success=True, data=profile, message="Profile retrieved successfully")
    except Exception as e:
        logging.error(f"Error retrieving profile: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/skills", response_model=APIResponse)
async def get_skills():
    try:
        skills_doc = await db.skills.find_one()
        if not skills_doc:
            raise HTTPException(status_code=404, detail="Skills not found")
        
        skills = skills_doc.get('skills', [])
        return APIResponse(success=True, data=skills, message="Skills retrieved successfully")
    except Exception as e:
        logging.error(f"Error retrieving skills: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/certifications", response_model=APIResponse)
async def get_certifications():
    try:
        cert_doc = await db.certifications.find_one()
        if not cert_doc:
            raise HTTPException(status_code=404, detail="Certifications not found")
        
        certifications = cert_doc.get('certifications', [])
        return APIResponse(success=True, data=certifications, message="Certifications retrieved successfully")
    except Exception as e:
        logging.error(f"Error retrieving certifications: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/experience", response_model=APIResponse)
async def get_experience():
    try:
        exp_doc = await db.experience.find_one()
        if not exp_doc:
            raise HTTPException(status_code=404, detail="Experience not found")
        
        experience = exp_doc.get('experience', [])
        return APIResponse(success=True, data=experience, message="Experience retrieved successfully")
    except Exception as e:
        logging.error(f"Error retrieving experience: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/projects", response_model=APIResponse)
async def get_projects():
    try:
        proj_doc = await db.projects.find_one()
        if not proj_doc:
            raise HTTPException(status_code=404, detail="Projects not found")
        
        projects = proj_doc.get('projects', [])
        return APIResponse(success=True, data=projects, message="Projects retrieved successfully")
    except Exception as e:
        logging.error(f"Error retrieving projects: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/education", response_model=APIResponse)
async def get_education():
    try:
        education = await db.education.find_one()
        if not education:
            raise HTTPException(status_code=404, detail="Education not found")
        
        # Remove MongoDB _id field
        education.pop('_id', None)
        return APIResponse(success=True, data=education, message="Education retrieved successfully")
    except Exception as e:
        logging.error(f"Error retrieving education: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/contact", response_model=APIResponse)
async def submit_contact_message(contact_data: ContactMessageCreate):
    try:
        message_obj = ContactMessage(**contact_data.dict())
        result = await db.contact_messages.insert_one(message_obj.dict())
        
        if result.inserted_id:
            return APIResponse(
                success=True, 
                data={"id": message_obj.id}, 
                message="Message sent successfully! I'll get back to you soon."
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to save message")
            
    except Exception as e:
        logging.error(f"Error saving contact message: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/contact/messages", response_model=APIResponse)
async def get_contact_messages():
    try:
        messages = await db.contact_messages.find().sort("timestamp", -1).to_list(100)
        # Remove MongoDB _id fields
        for message in messages:
            message.pop('_id', None)
        
        return APIResponse(success=True, data=messages, message="Messages retrieved successfully")
    except Exception as e:
        logging.error(f"Error retrieving contact messages: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Database seeding endpoint (for initial setup)
@api_router.post("/seed-database", response_model=APIResponse)
async def seed_database():
    try:
        # This will be used to populate the database with initial data
        return APIResponse(success=True, data=None, message="Database seeding endpoint ready")
    except Exception as e:
        logging.error(f"Error seeding database: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
