# API Contracts & Integration Protocol

## Overview
This document outlines the API contracts and integration strategy to transform the portfolio website from frontend-only with mock data to a full-stack application with backend database integration.

## Current Mock Data Structure

### 1. Profile Data (`profileData`)
- **Current**: Static object in mock.js
- **Backend Implementation**: Store in MongoDB collection `profiles`
- **API Endpoint**: `GET /api/profile`

### 2. Skills (`skills`)
- **Current**: Array in mock.js
- **Backend Implementation**: Store in MongoDB collection `skills`
- **API Endpoint**: `GET /api/skills`

### 3. Certifications (`certifications`)
- **Current**: Array in mock.js  
- **Backend Implementation**: Store in MongoDB collection `certifications`
- **API Endpoint**: `GET /api/certifications`

### 4. Experience (`experience`)
- **Current**: Array in mock.js
- **Backend Implementation**: Store in MongoDB collection `experience`
- **API Endpoint**: `GET /api/experience`

### 5. Projects (`projects`)
- **Current**: Array in mock.js
- **Backend Implementation**: Store in MongoDB collection `projects`
- **API Endpoint**: `GET /api/projects`

### 6. Education (`education`)
- **Current**: Object in mock.js
- **Backend Implementation**: Store in MongoDB collection `education`
- **API Endpoint**: `GET /api/education`

## New API Endpoints

### Contact Form Functionality
- **Endpoint**: `POST /api/contact`
- **Purpose**: Store contact form submissions
- **Collection**: `contact_messages`
- **Schema**:
  ```json
  {
    "name": "string",
    "email": "string", 
    "message": "string",
    "timestamp": "datetime",
    "status": "new|read|responded"
  }
  ```

### Admin Endpoints (Future Enhancement)
- **GET /api/contact/messages** - Retrieve contact messages
- **PUT /api/contact/messages/:id** - Mark as read/responded

## Database Schema Design

### Collections Structure:
1. `profiles` - Single document with profile information
2. `skills` - Array of skill objects with categories and levels
3. `certifications` - Array of certification objects
4. `experience` - Array of work experience objects
5. `projects` - Array of project objects
6. `education` - Single document with education information
7. `contact_messages` - Array of contact form submissions

## Frontend Integration Changes

### Data Fetching Strategy:
1. Replace mock imports with API calls using axios
2. Implement loading states for each section
3. Add error handling for API failures
4. Use React hooks (useState, useEffect) for data management

### Component Updates Required:
- `About.jsx` - Fetch profile data
- `Skills.jsx` - Fetch skills data
- `Certifications.jsx` - Fetch certifications data
- `Experience.jsx` - Fetch experience data
- `Projects.jsx` - Fetch projects data
- `Contact.jsx` - Submit form data to backend

## Implementation Steps:

### Phase 1: Backend Development
1. Create MongoDB models for each collection
2. Implement CRUD endpoints for data retrieval
3. Seed database with current mock data
4. Implement contact form submission endpoint

### Phase 2: Frontend Integration
1. Create API service functions
2. Update components to use API calls instead of mock data
3. Add loading states and error handling
4. Remove mock.js dependencies

### Phase 3: Testing & Validation
1. Test all API endpoints
2. Verify frontend-backend integration
3. Test contact form functionality
4. Ensure responsive behavior with real data

## API Response Format:
```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

## Error Handling Format:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error context"
}
```

## Environment Variables:
- `MONGO_URL` - Already configured
- `DB_NAME` - Already configured as 'portfolio'

This protocol ensures seamless transition from mock data to real backend functionality while maintaining the existing UI/UX experience.