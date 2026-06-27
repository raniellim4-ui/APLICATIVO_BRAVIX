---
name: api-conventions
description: API design patterns for this codebase
---

# API Conventions

Guidelines for writing API endpoints in this codebase.

## Core Principles

When writing API endpoints, follow these conventions:

### 1. RESTful Naming Conventions

- Use **nouns** for resources, not verbs
  - ✅ Good: `/users`, `/posts`, `/comments`
  - ❌ Bad: `/getUsers`, `/createPost`, `/deleteComment`

- Use **HTTP methods** to indicate actions
  - `GET` - Retrieve resource(s)
  - `POST` - Create new resource
  - `PUT` - Update entire resource
  - `PATCH` - Partial update
  - `DELETE` - Remove resource

- Use **nested resources** for relationships
  - `/users/:id/posts` - Get all posts by a user
  - `/posts/:id/comments` - Get all comments on a post

### 2. Consistent Error Formats

All error responses must follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {},
    "statusCode": 400
  }
}
```

**Common error codes:**
- `BAD_REQUEST` (400) - Invalid input
- `UNAUTHORIZED` (401) - Missing/invalid authentication
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `UNPROCESSABLE_ENTITY` (422) - Validation failed
- `INTERNAL_SERVER_ERROR` (500) - Server error

### 3. Request Validation

- **Validate all inputs** at the endpoint entry point
- **Return 422** for validation errors with detailed field information
- **Include validation rules** in API documentation

```json
{
  "error": {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format",
      "password": "Must be at least 8 characters"
    },
    "statusCode": 422
  }
}
```

## Response Format

All successful responses should include:

```json
{
  "data": {},
  "meta": {
    "timestamp": "2026-06-27T10:00:00Z",
    "version": "1.0"
  }
}
```

## Pagination

For list endpoints:

```json
{
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## Rate Limiting

Include rate limit headers in all responses:
- `X-RateLimit-Limit` - Max requests per window
- `X-RateLimit-Remaining` - Requests left
- `X-RateLimit-Reset` - Unix timestamp when limit resets

## Authentication

- Use **Bearer tokens** in Authorization header
- Include `Authorization: Bearer <token>` in requests
- Return `401` for missing/invalid tokens

## Usage

Use this skill when:
- Designing new API endpoints
- Reviewing existing API implementations
- Ensuring consistency across endpoints
- Handling errors and validation

Example:
```
claude "Design a POST endpoint for creating users following api-conventions"
```
