# TaskFlow Backend Implementation Contracts

## API Endpoints to Implement

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

### Category Endpoints  
- `GET /api/categories` - Get all categories for current user
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Task Endpoints
- `GET /api/tasks` - Get all tasks for current user (with filtering)
- `POST /api/tasks` - Create new task  
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model  
```javascript
{
  _id: ObjectId,
  name: String,
  color: String,
  icon: String,
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  categoryId: ObjectId (ref: Category),
  priority: String (enum: 'low', 'medium', 'high'),
  dueDate: Date,
  completed: Boolean (default: false),
  tags: [String],
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Mock Data to Replace

### From mock.js:
1. **mockUsers** - Replace with User authentication system
2. **mockCategories** - Replace with user-specific categories from database
3. **mockTasks** - Replace with user-specific tasks from database  
4. **mockAPI functions** - Replace with actual HTTP requests to backend

### Authentication Flow:
- Remove localStorage-based auth simulation
- Implement JWT-based authentication
- Add authentication middleware for protected routes

## Frontend Integration Changes

### Remove Mock Dependencies:
- Remove import of `mockAPI` and `localStorageAPI` from mock.js
- Replace with axios calls to actual backend endpoints
- Add authentication context with JWT tokens
- Remove localStorage task persistence (handled by backend)

### API Service Layer:
Create `/frontend/src/services/api.js` with:
- Authentication service methods
- Task CRUD methods
- Category management methods
- HTTP interceptors for auth tokens
- Error handling

### Authentication Updates:
- Add JWT token management
- Implement protected route middleware
- Add token refresh logic
- Handle auth errors and redirects

## Backend Implementation Plan

### 1. Database Setup
- User authentication with bcrypt password hashing
- JWT token generation and validation
- MongoDB indexes for performance
- Data validation with Mongoose schemas

### 2. Middleware
- Authentication middleware for protected routes
- CORS configuration
- Request validation middleware
- Error handling middleware

### 3. Security Features
- Password hashing with bcrypt
- JWT token expiration
- User data isolation (users only see their own data)
- Input validation and sanitization

### 4. API Features
- RESTful API design
- Proper HTTP status codes
- Comprehensive error responses
- Query filtering for tasks (by category, priority, status)
- Pagination for large datasets

## Integration Steps

1. **Backend Implementation**: Create all models, routes, and middleware
2. **Frontend Service Layer**: Replace mock with real API calls
3. **Authentication Integration**: Add JWT handling to frontend
4. **Data Migration**: Initialize default categories for new users
5. **Testing**: Verify all functionality works end-to-end

## Default Categories for New Users
When a user registers, auto-create these default categories:
- Work (Blue, Briefcase icon)
- Personal (Green, User icon)  
- Shopping (Orange, Shopping-bag icon)
- Health (Red, Heart icon)
- Learning (Purple, Book icon)