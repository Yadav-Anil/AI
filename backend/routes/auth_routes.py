from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.User import User, UserCreate, UserLogin, UserResponse
from auth import get_password_hash, verify_password, create_access_token, get_current_user_id
import os

router = APIRouter(prefix="/auth", tags=["authentication"])

# Get database dependency
def get_database():
    from server import db
    return db

@router.post("/register", response_model=dict)
async def register_user(user_data: UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Register a new user."""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    password_hash = get_password_hash(user_data.password)
    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=password_hash
    )
    
    # Insert user into database
    user_dict = user.dict()
    await db.users.insert_one(user_dict)
    
    # Create default categories for the user
    await create_default_categories(db, user.id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            created_at=user.created_at
        )
    }

@router.post("/login", response_model=dict)
async def login_user(login_data: UserLogin, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Login user."""
    # Find user by email
    user_doc = await db.users.find_one({"email": login_data.email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user_doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user_doc["id"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user_doc["id"],
            name=user_doc["name"],
            email=user_doc["email"],
            created_at=user_doc["created_at"]
        )
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current user profile."""
    user_doc = await db.users.find_one({"id": current_user_id})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user_doc["id"],
        name=user_doc["name"],
        email=user_doc["email"],
        created_at=user_doc["created_at"]
    )

async def create_default_categories(db: AsyncIOMotorDatabase, user_id: str):
    """Create default categories for a new user."""
    from models.Category import Category
    
    default_categories = [
        {"name": "Work", "color": "#3B82F6", "icon": "briefcase"},
        {"name": "Personal", "color": "#10B981", "icon": "user"},
        {"name": "Shopping", "color": "#F59E0B", "icon": "shopping-bag"},
        {"name": "Health", "color": "#EF4444", "icon": "heart"},
        {"name": "Learning", "color": "#8B5CF6", "icon": "book"}
    ]
    
    categories_to_insert = []
    for cat_data in default_categories:
        category = Category(
            name=cat_data["name"],
            color=cat_data["color"],
            icon=cat_data["icon"],
            user_id=user_id
        )
        categories_to_insert.append(category.dict())
    
    await db.categories.insert_many(categories_to_insert)