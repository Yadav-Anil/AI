from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.Category import Category, CategoryCreate, CategoryUpdate, CategoryResponse
from auth import get_current_user_id
from datetime import datetime

router = APIRouter(prefix="/categories", tags=["categories"])

# Get database dependency
def get_database():
    from server import db
    return db

@router.get("", response_model=List[CategoryResponse])
async def get_categories(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all categories for the current user."""
    categories = await db.categories.find({"user_id": current_user_id}).to_list(100)
    return [CategoryResponse(**category) for category in categories]

@router.post("", response_model=CategoryResponse)
async def create_category(
    category_data: CategoryCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new category for the current user."""
    category = Category(
        name=category_data.name,
        color=category_data.color,
        icon=category_data.icon,
        user_id=current_user_id
    )
    
    category_dict = category.dict()
    await db.categories.insert_one(category_dict)
    
    return CategoryResponse(**category_dict)

@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    category_data: CategoryUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update a category for the current user."""
    # Check if category exists and belongs to user
    existing_category = await db.categories.find_one({
        "id": category_id,
        "user_id": current_user_id
    })
    
    if not existing_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Prepare update data
    update_data = category_data.dict(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        
        # Update category in database
        await db.categories.update_one(
            {"id": category_id, "user_id": current_user_id},
            {"$set": update_data}
        )
    
    # Return updated category
    updated_category = await db.categories.find_one({
        "id": category_id,
        "user_id": current_user_id
    })
    
    return CategoryResponse(**updated_category)

@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a category for the current user."""
    # Check if category exists and belongs to user
    existing_category = await db.categories.find_one({
        "id": category_id,
        "user_id": current_user_id
    })
    
    if not existing_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if there are tasks using this category
    tasks_count = await db.tasks.count_documents({
        "category_id": category_id,
        "user_id": current_user_id
    })
    
    if tasks_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete category. {tasks_count} tasks are using this category."
        )
    
    # Delete category
    result = await db.categories.delete_one({
        "id": category_id,
        "user_id": current_user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    return {"message": "Category deleted successfully"}