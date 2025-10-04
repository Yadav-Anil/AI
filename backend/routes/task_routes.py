from fastapi import APIRouter, HTTPException, status, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from models.Task import Task, TaskCreate, TaskUpdate, TaskResponse
from auth import get_current_user_id
from datetime import datetime, date

router = APIRouter(prefix="/tasks", tags=["tasks"])

# Get database dependency
def get_database():
    from server import db
    return db

@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    category_id: Optional[str] = Query(None, description="Filter by category"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    overdue: Optional[bool] = Query(None, description="Filter overdue tasks"),
    search: Optional[str] = Query(None, description="Search in title, description, and tags"),
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all tasks for the current user with optional filtering."""
    # Build filter query
    filter_query = {"user_id": current_user_id}
    
    if category_id:
        filter_query["category_id"] = category_id
    
    if priority:
        filter_query["priority"] = priority
    
    if completed is not None:
        filter_query["completed"] = completed
    
    if overdue is not None and overdue:
        # Filter for overdue tasks (not completed and due date < today)
        today = date.today()
        filter_query["completed"] = False
        filter_query["due_date"] = {"$lt": today}
    
    # Add search functionality
    if search:
        search_regex = {"$regex": search, "$options": "i"}
        filter_query["$or"] = [
            {"title": search_regex},
            {"description": search_regex},
            {"tags": {"$in": [search_regex]}}
        ]
    
    # Get tasks from database
    tasks = await db.tasks.find(filter_query).sort("created_at", -1).to_list(1000)
    
    # Format response
    task_responses = []
    for task in tasks:
        task_response = TaskResponse(
            id=task["id"],
            title=task["title"],
            description=task.get("description", ""),
            category_id=task["category_id"],
            priority=task["priority"],
            due_date=task["due_date"].strftime("%Y-%m-%d"),
            completed=task["completed"],
            tags=task["tags"],
            created_at=task["created_at"].strftime("%Y-%m-%d")
        )
        task_responses.append(task_response)
    
    return task_responses

@router.post("", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new task for the current user."""
    # Verify category exists and belongs to user
    category = await db.categories.find_one({
        "id": task_data.category_id,
        "user_id": current_user_id
    })
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category ID"
        )
    
    # Create task
    task = Task(
        title=task_data.title,
        description=task_data.description,
        category_id=task_data.category_id,
        priority=task_data.priority,
        due_date=task_data.due_date,
        tags=task_data.tags,
        user_id=current_user_id
    )
    
    task_dict = task.dict()
    # Convert date to datetime for MongoDB compatibility
    if isinstance(task_dict['due_date'], date):
        task_dict['due_date'] = datetime.combine(task_dict['due_date'], datetime.min.time())
    
    await db.tasks.insert_one(task_dict)
    
    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        category_id=task.category_id,
        priority=task.priority,
        due_date=task.due_date.strftime("%Y-%m-%d"),
        completed=task.completed,
        tags=task.tags,
        created_at=task.created_at.strftime("%Y-%m-%d")
    )

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update a task for the current user."""
    # Check if task exists and belongs to user
    existing_task = await db.tasks.find_one({
        "id": task_id,
        "user_id": current_user_id
    })
    
    if not existing_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # If category_id is being updated, verify it exists and belongs to user
    if task_data.category_id:
        category = await db.categories.find_one({
            "id": task_data.category_id,
            "user_id": current_user_id
        })
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid category ID"
            )
    
    # Prepare update data
    update_data = task_data.dict(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        
        # Convert date to datetime for MongoDB compatibility
        if 'due_date' in update_data and isinstance(update_data['due_date'], date):
            update_data['due_date'] = datetime.combine(update_data['due_date'], datetime.min.time())
        
        # Update task in database
        await db.tasks.update_one(
            {"id": task_id, "user_id": current_user_id},
            {"$set": update_data}
        )
    
    # Return updated task
    updated_task = await db.tasks.find_one({
        "id": task_id,
        "user_id": current_user_id
    })
    
    return TaskResponse(
        id=updated_task["id"],
        title=updated_task["title"],
        description=updated_task.get("description", ""),
        category_id=updated_task["category_id"],
        priority=updated_task["priority"],
        due_date=updated_task["due_date"].strftime("%Y-%m-%d"),
        completed=updated_task["completed"],
        tags=updated_task["tags"],
        created_at=updated_task["created_at"].strftime("%Y-%m-%d")
    )

@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task_completion(
    task_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Toggle task completion status."""
    # Check if task exists and belongs to user
    existing_task = await db.tasks.find_one({
        "id": task_id,
        "user_id": current_user_id
    })
    
    if not existing_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Toggle completion status
    new_completed_status = not existing_task["completed"]
    
    await db.tasks.update_one(
        {"id": task_id, "user_id": current_user_id},
        {"$set": {
            "completed": new_completed_status,
            "updated_at": datetime.utcnow()
        }}
    )
    
    # Return updated task
    updated_task = await db.tasks.find_one({
        "id": task_id,
        "user_id": current_user_id
    })
    
    return TaskResponse(
        id=updated_task["id"],
        title=updated_task["title"],
        description=updated_task.get("description", ""),
        category_id=updated_task["category_id"],
        priority=updated_task["priority"],
        due_date=updated_task["due_date"].strftime("%Y-%m-%d"),
        completed=updated_task["completed"],
        tags=updated_task["tags"],
        created_at=updated_task["created_at"].strftime("%Y-%m-%d")
    )

@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a task for the current user."""
    # Check if task exists and belongs to user
    existing_task = await db.tasks.find_one({
        "id": task_id,
        "user_id": current_user_id
    })
    
    if not existing_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Delete task
    result = await db.tasks.delete_one({
        "id": task_id,
        "user_id": current_user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return {"message": "Task deleted successfully"}