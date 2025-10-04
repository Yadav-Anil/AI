from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class CategoryBase(BaseModel):
    name: str
    color: str
    icon: str

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class Category(CategoryBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        from_attributes = True

class CategoryResponse(BaseModel):
    id: str
    name: str
    color: str
    icon: str
    created_at: datetime