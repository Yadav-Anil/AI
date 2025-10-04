from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum
import uuid

class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = ""
    category_id: str
    priority: PriorityEnum = PriorityEnum.medium
    due_date: date
    tags: List[str] = []

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    due_date: Optional[date] = None
    completed: Optional[bool] = None
    tags: Optional[List[str]] = None

class Task(TaskBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    completed: bool = False
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        from_attributes = True

class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    category_id: str
    priority: str
    due_date: str  # Will be formatted as YYYY-MM-DD
    completed: bool
    tags: List[str]
    created_at: str  # Will be formatted as YYYY-MM-DD