#!/usr/bin/env python3
"""
TaskFlow Backend API Testing Suite
Tests all authentication, categories, and tasks endpoints
"""

import requests
import json
import sys
from datetime import datetime, date, timedelta
import os

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

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        
    def log_success(self, test_name):
        print(f"✅ {test_name}")
        self.passed += 1
        
    def log_failure(self, test_name, error):
        print(f"❌ {test_name}: {error}")
        self.failed += 1
        self.errors.append(f"{test_name}: {error}")
        
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"TEST SUMMARY: {self.passed}/{total} tests passed")
        if self.errors:
            print(f"\nFAILED TESTS:")
            for error in self.errors:
                print(f"  - {error}")
        print(f"{'='*60}")
        return self.failed == 0

def test_health_check():
    """Test basic health check endpoint"""
    results = TestResults()
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            results.log_success("Health check endpoint")
        else:
            results.log_failure("Health check endpoint", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Health check endpoint", str(e))
    
    return results

def test_authentication():
    """Test all authentication endpoints"""
    results = TestResults()
    
    # Test data with unique email using timestamp
    import time
    timestamp = str(int(time.time()))
    test_user = {
        "name": "John Doe",
        "email": f"john.doe.{timestamp}@example.com",
        "password": "securepassword123"
    }
    
    # Test user registration
    try:
        response = requests.post(f"{API_URL}/auth/register", json=test_user, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                results.log_success("User registration")
                access_token = data["access_token"]
                user_id = data["user"]["id"]
            else:
                results.log_failure("User registration", "Missing access_token or user in response")
                return results
        else:
            results.log_failure("User registration", f"Status: {response.status_code}, Response: {response.text}")
            return results
    except Exception as e:
        results.log_failure("User registration", str(e))
        return results
    
    # Test duplicate registration (should fail)
    try:
        response = requests.post(f"{API_URL}/auth/register", json=test_user, timeout=10)
        if response.status_code == 400:
            results.log_success("Duplicate registration prevention")
        else:
            results.log_failure("Duplicate registration prevention", f"Expected 400, got {response.status_code}")
    except Exception as e:
        results.log_failure("Duplicate registration prevention", str(e))
    
    # Test user login
    login_data = {
        "email": test_user["email"],
        "password": test_user["password"]
    }
    
    try:
        response = requests.post(f"{API_URL}/auth/login", json=login_data, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                results.log_success("User login")
                login_token = data["access_token"]
            else:
                results.log_failure("User login", "Missing access_token or user in response")
        else:
            results.log_failure("User login", f"Status: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.log_failure("User login", str(e))
    
    # Test login with wrong password
    wrong_login = {
        "email": test_user["email"],
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(f"{API_URL}/auth/login", json=wrong_login, timeout=10)
        if response.status_code == 401:
            results.log_success("Invalid login prevention")
        else:
            results.log_failure("Invalid login prevention", f"Expected 401, got {response.status_code}")
    except Exception as e:
        results.log_failure("Invalid login prevention", str(e))
    
    # Test getting current user profile
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        response = requests.get(f"{API_URL}/auth/me", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data["email"] == test_user["email"] and data["name"] == test_user["name"]:
                results.log_success("Get current user profile")
            else:
                results.log_failure("Get current user profile", "User data mismatch")
        else:
            results.log_failure("Get current user profile", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Get current user profile", str(e))
    
    # Test unauthorized access
    try:
        response = requests.get(f"{API_URL}/auth/me", timeout=10)
        if response.status_code == 401 or response.status_code == 403:
            results.log_success("Unauthorized access prevention")
        else:
            results.log_failure("Unauthorized access prevention", f"Expected 401/403, got {response.status_code}")
    except Exception as e:
        results.log_failure("Unauthorized access prevention", str(e))
    
    # Test invalid token
    invalid_headers = {"Authorization": "Bearer invalid_token"}
    try:
        response = requests.get(f"{API_URL}/auth/me", headers=invalid_headers, timeout=10)
        if response.status_code == 401:
            results.log_success("Invalid token prevention")
        else:
            results.log_failure("Invalid token prevention", f"Expected 401, got {response.status_code}")
    except Exception as e:
        results.log_failure("Invalid token prevention", str(e))
    
    # Store token for other tests
    results.access_token = access_token
    results.user_id = user_id
    
    return results

def test_categories(auth_results):
    """Test all category endpoints"""
    results = TestResults()
    
    if not hasattr(auth_results, 'access_token'):
        results.log_failure("Categories test setup", "No access token available")
        return results
    
    headers = {"Authorization": f"Bearer {auth_results.access_token}"}
    
    # Test getting default categories (should be created during registration)
    try:
        response = requests.get(f"{API_URL}/categories", headers=headers, timeout=10)
        if response.status_code == 200:
            categories = response.json()
            if len(categories) >= 5:  # Should have default categories
                results.log_success("Get default categories")
                default_category_id = categories[0]["id"]
            else:
                results.log_failure("Get default categories", f"Expected at least 5 categories, got {len(categories)}")
                return results
        else:
            results.log_failure("Get default categories", f"Status: {response.status_code}")
            return results
    except Exception as e:
        results.log_failure("Get default categories", str(e))
        return results
    
    # Test creating a custom category
    new_category = {
        "name": "Testing",
        "color": "#FF5722",
        "icon": "test-tube"
    }
    
    try:
        response = requests.post(f"{API_URL}/categories", json=new_category, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data["name"] == new_category["name"]:
                results.log_success("Create custom category")
                custom_category_id = data["id"]
            else:
                results.log_failure("Create custom category", "Category data mismatch")
        else:
            results.log_failure("Create custom category", f"Status: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.log_failure("Create custom category", str(e))
    
    # Test updating a category
    update_data = {
        "name": "Updated Testing",
        "color": "#9C27B0"
    }
    
    try:
        response = requests.put(f"{API_URL}/categories/{custom_category_id}", json=update_data, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data["name"] == update_data["name"] and data["color"] == update_data["color"]:
                results.log_success("Update category")
            else:
                results.log_failure("Update category", "Updated data mismatch")
        else:
            results.log_failure("Update category", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Update category", str(e))
    
    # Test deleting category without tasks (should succeed)
    try:
        response = requests.delete(f"{API_URL}/categories/{custom_category_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            results.log_success("Delete empty category")
        else:
            results.log_failure("Delete empty category", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Delete empty category", str(e))
    
    # Test unauthorized category access
    try:
        response = requests.get(f"{API_URL}/categories", timeout=10)
        if response.status_code == 401 or response.status_code == 403:
            results.log_success("Unauthorized category access prevention")
        else:
            results.log_failure("Unauthorized category access prevention", f"Expected 401/403, got {response.status_code}")
    except Exception as e:
        results.log_failure("Unauthorized category access prevention", str(e))
    
    # Store category ID for task tests
    results.category_id = default_category_id
    
    return results

def test_tasks(auth_results, category_results):
    """Test all task endpoints"""
    results = TestResults()
    
    if not hasattr(auth_results, 'access_token') or not hasattr(category_results, 'category_id'):
        results.log_failure("Tasks test setup", "Missing access token or category ID")
        return results
    
    headers = {"Authorization": f"Bearer {auth_results.access_token}"}
    category_id = category_results.category_id
    
    # Test getting tasks (should be empty for new user)
    try:
        response = requests.get(f"{API_URL}/tasks", headers=headers, timeout=10)
        if response.status_code == 200:
            tasks = response.json()
            if len(tasks) == 0:
                results.log_success("Get empty tasks list")
            else:
                results.log_failure("Get empty tasks list", f"Expected 0 tasks, got {len(tasks)}")
        else:
            results.log_failure("Get empty tasks list", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Get empty tasks list", str(e))
    
    # Test creating a new task
    tomorrow = (date.today() + timedelta(days=1)).strftime("%Y-%m-%d")
    new_task = {
        "title": "Complete API Testing",
        "description": "Test all TaskFlow API endpoints thoroughly",
        "category_id": category_id,
        "priority": "high",
        "due_date": tomorrow,
        "tags": ["testing", "api", "backend"]
    }
    
    try:
        response = requests.post(f"{API_URL}/tasks", json=new_task, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data["title"] == new_task["title"] and data["priority"] == new_task["priority"]:
                results.log_success("Create new task")
                task_id = data["id"]
            else:
                results.log_failure("Create new task", "Task data mismatch")
        else:
            results.log_failure("Create new task", f"Status: {response.status_code}, Response: {response.text}")
            return results
    except Exception as e:
        results.log_failure("Create new task", str(e))
        return results
    
    # Test creating task with invalid category
    invalid_task = {
        "title": "Invalid Task",
        "category_id": "invalid-category-id",
        "priority": "medium",
        "due_date": tomorrow,
        "tags": []
    }
    
    try:
        response = requests.post(f"{API_URL}/tasks", json=invalid_task, headers=headers, timeout=10)
        if response.status_code == 400:
            results.log_success("Invalid category prevention")
        else:
            results.log_failure("Invalid category prevention", f"Expected 400, got {response.status_code}")
    except Exception as e:
        results.log_failure("Invalid category prevention", str(e))
    
    # Test updating a task
    update_data = {
        "title": "Updated API Testing Task",
        "description": "Updated description for testing",
        "priority": "medium",
        "tags": ["testing", "api", "updated"]
    }
    
    try:
        response = requests.put(f"{API_URL}/tasks/{task_id}", json=update_data, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data["title"] == update_data["title"] and data["priority"] == update_data["priority"]:
                results.log_success("Update task")
            else:
                results.log_failure("Update task", "Updated data mismatch")
        else:
            results.log_failure("Update task", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Update task", str(e))
    
    # Test toggling task completion
    try:
        response = requests.patch(f"{API_URL}/tasks/{task_id}/toggle", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data["completed"] == True:
                results.log_success("Toggle task completion")
            else:
                results.log_failure("Toggle task completion", "Task not marked as completed")
        else:
            results.log_failure("Toggle task completion", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Toggle task completion", str(e))
    
    # Test getting tasks with filters
    try:
        # Filter by category
        response = requests.get(f"{API_URL}/tasks?category_id={category_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            tasks = response.json()
            if len(tasks) >= 1:
                results.log_success("Filter tasks by category")
            else:
                results.log_failure("Filter tasks by category", "No tasks found with category filter")
        else:
            results.log_failure("Filter tasks by category", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Filter tasks by category", str(e))
    
    try:
        # Filter by priority
        response = requests.get(f"{API_URL}/tasks?priority=medium", headers=headers, timeout=10)
        if response.status_code == 200:
            tasks = response.json()
            results.log_success("Filter tasks by priority")
        else:
            results.log_failure("Filter tasks by priority", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Filter tasks by priority", str(e))
    
    try:
        # Filter by completion status
        response = requests.get(f"{API_URL}/tasks?completed=true", headers=headers, timeout=10)
        if response.status_code == 200:
            tasks = response.json()
            results.log_success("Filter tasks by completion")
        else:
            results.log_failure("Filter tasks by completion", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Filter tasks by completion", str(e))
    
    try:
        # Search tasks
        response = requests.get(f"{API_URL}/tasks?search=API", headers=headers, timeout=10)
        if response.status_code == 200:
            tasks = response.json()
            results.log_success("Search tasks")
        else:
            results.log_failure("Search tasks", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Search tasks", str(e))
    
    # Test deleting a task
    try:
        response = requests.delete(f"{API_URL}/tasks/{task_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            results.log_success("Delete task")
        else:
            results.log_failure("Delete task", f"Status: {response.status_code}")
    except Exception as e:
        results.log_failure("Delete task", str(e))
    
    # Test unauthorized task access
    try:
        response = requests.get(f"{API_URL}/tasks", timeout=10)
        if response.status_code == 401 or response.status_code == 403:
            results.log_success("Unauthorized task access prevention")
        else:
            results.log_failure("Unauthorized task access prevention", f"Expected 401/403, got {response.status_code}")
    except Exception as e:
        results.log_failure("Unauthorized task access prevention", str(e))
    
    return results

def test_user_data_isolation():
    """Test that users can't access other users' data"""
    results = TestResults()
    
    # Create two different users with unique emails
    import time
    timestamp = str(int(time.time()))
    user1_data = {
        "name": "User One",
        "email": f"user1.{timestamp}@example.com",
        "password": "password123"
    }
    
    user2_data = {
        "name": "User Two", 
        "email": f"user2.{timestamp}@example.com",
        "password": "password456"
    }
    
    try:
        # Register both users
        response1 = requests.post(f"{API_URL}/auth/register", json=user1_data, timeout=10)
        response2 = requests.post(f"{API_URL}/auth/register", json=user2_data, timeout=10)
        
        if response1.status_code == 200 and response2.status_code == 200:
            token1 = response1.json()["access_token"]
            token2 = response2.json()["access_token"]
            
            headers1 = {"Authorization": f"Bearer {token1}"}
            headers2 = {"Authorization": f"Bearer {token2}"}
            
            # Get categories for both users
            cats1_response = requests.get(f"{API_URL}/categories", headers=headers1, timeout=10)
            cats2_response = requests.get(f"{API_URL}/categories", headers=headers2, timeout=10)
            
            if cats1_response.status_code == 200 and cats2_response.status_code == 200:
                cats1 = cats1_response.json()
                cats2 = cats2_response.json()
                
                # Check that users have separate category sets
                cats1_ids = {cat["id"] for cat in cats1}
                cats2_ids = {cat["id"] for cat in cats2}
                
                if cats1_ids.isdisjoint(cats2_ids):
                    results.log_success("User data isolation - categories")
                else:
                    results.log_failure("User data isolation - categories", "Users sharing category IDs")
            else:
                results.log_failure("User data isolation setup", "Failed to get categories")
        else:
            results.log_failure("User data isolation setup", "Failed to register test users")
    except Exception as e:
        results.log_failure("User data isolation", str(e))
    
    return results

def main():
    """Run all tests"""
    print("🚀 Starting TaskFlow Backend API Tests")
    print(f"Testing against: {API_URL}")
    print("="*60)
    
    all_results = TestResults()
    
    # Run all test suites
    print("\n📋 Testing Health Check...")
    health_results = test_health_check()
    all_results.passed += health_results.passed
    all_results.failed += health_results.failed
    all_results.errors.extend(health_results.errors)
    
    print("\n🔐 Testing Authentication...")
    auth_results = test_authentication()
    all_results.passed += auth_results.passed
    all_results.failed += auth_results.failed
    all_results.errors.extend(auth_results.errors)
    
    print("\n📁 Testing Categories...")
    category_results = test_categories(auth_results)
    all_results.passed += category_results.passed
    all_results.failed += category_results.failed
    all_results.errors.extend(category_results.errors)
    
    print("\n✅ Testing Tasks...")
    task_results = test_tasks(auth_results, category_results)
    all_results.passed += task_results.passed
    all_results.failed += task_results.failed
    all_results.errors.extend(task_results.errors)
    
    print("\n🔒 Testing User Data Isolation...")
    isolation_results = test_user_data_isolation()
    all_results.passed += isolation_results.passed
    all_results.failed += isolation_results.failed
    all_results.errors.extend(isolation_results.errors)
    
    # Print final summary
    success = all_results.summary()
    
    if success:
        print("\n🎉 All tests passed! TaskFlow Backend API is working correctly.")
        sys.exit(0)
    else:
        print(f"\n💥 {all_results.failed} tests failed. Please check the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    main()