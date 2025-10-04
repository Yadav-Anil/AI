#!/usr/bin/env python3
"""
Additional TaskFlow Backend API Tests
Test category deletion with tasks protection
"""

import requests
import json
from datetime import datetime, date, timedelta
import time

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

def test_category_deletion_with_tasks():
    """Test that categories with tasks cannot be deleted"""
    print("🧪 Testing category deletion protection...")
    
    # Create a test user
    timestamp = str(int(time.time()))
    test_user = {
        "name": "Test User",
        "email": f"test.{timestamp}@example.com",
        "password": "testpassword123"
    }
    
    # Register user
    response = requests.post(f"{API_URL}/auth/register", json=test_user, timeout=10)
    if response.status_code != 200:
        print(f"❌ Failed to register user: {response.status_code}")
        return False
    
    access_token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Get categories
    response = requests.get(f"{API_URL}/categories", headers=headers, timeout=10)
    if response.status_code != 200:
        print(f"❌ Failed to get categories: {response.status_code}")
        return False
    
    categories = response.json()
    category_id = categories[0]["id"]
    
    # Create a task in this category
    tomorrow = (date.today() + timedelta(days=1)).strftime("%Y-%m-%d")
    new_task = {
        "title": "Test Task",
        "description": "A task to test category deletion protection",
        "category_id": category_id,
        "priority": "medium",
        "due_date": tomorrow,
        "tags": ["test"]
    }
    
    response = requests.post(f"{API_URL}/tasks", json=new_task, headers=headers, timeout=10)
    if response.status_code != 200:
        print(f"❌ Failed to create task: {response.status_code}")
        return False
    
    print("✅ Created task in category")
    
    # Try to delete the category (should fail)
    response = requests.delete(f"{API_URL}/categories/{category_id}", headers=headers, timeout=10)
    if response.status_code == 400:
        error_detail = response.json().get("detail", "")
        if "tasks are using this category" in error_detail:
            print("✅ Category deletion properly prevented when tasks exist")
            return True
        else:
            print(f"❌ Wrong error message: {error_detail}")
            return False
    else:
        print(f"❌ Expected 400 error, got {response.status_code}")
        return False

if __name__ == "__main__":
    success = test_category_deletion_with_tasks()
    if success:
        print("\n🎉 Additional test passed!")
    else:
        print("\n💥 Additional test failed!")