# API Conventions Skill

A Claude Code skill for maintaining consistent API design patterns across your codebase.

## Overview

This skill provides standardized guidelines for:
- RESTful endpoint naming and structure
- Consistent error response formats
- Request validation patterns
- Response data structures
- Rate limiting implementation
- Authentication mechanisms

## Installation

```bash
npx skills add ~/.claude/skills/api-conventions
```

## Key Conventions

### RESTful Naming
- Use nouns for resources: `/users`, `/posts`, `/comments`
- Use HTTP methods for actions: GET, POST, PUT, PATCH, DELETE
- Nest resources for relationships: `/users/:id/posts`

### Error Responses
All errors follow a consistent format with code, message, details, and status code.

### Request Validation
Validate all inputs and return detailed validation errors with 422 status code.

### Response Format
All responses include data, metadata (timestamp, version), and pagination info for lists.

### Rate Limiting
Include X-RateLimit headers in all responses.

### Authentication
Use Bearer tokens in Authorization headers for secure endpoints.

## Usage Examples

**Design a new endpoint:**
```bash
claude "Design a REST endpoint for managing user posts following api-conventions"
```

**Review existing endpoint:**
```bash
claude "Review this endpoint for api-conventions compliance"
```

**Implement validation:**
```bash
claude "Add validation for email field following api-conventions"
```

## When to Use

- Writing new API endpoints
- Reviewing endpoint implementations
- Designing error handling
- Implementing request validation
- Structuring response data
- Setting up authentication
- Configuring rate limiting

## Error Codes Reference

| Code | Status | Use Case |
|------|--------|----------|
| BAD_REQUEST | 400 | Invalid input data |
| UNAUTHORIZED | 401 | Missing/invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource doesn't exist |
| CONFLICT | 409 | Resource already exists |
| UNPROCESSABLE_ENTITY | 422 | Validation failed |
| INTERNAL_SERVER_ERROR | 500 | Server error |

## Response Structure

```json
{
  "data": { /* resource data */ },
  "meta": {
    "timestamp": "ISO-8601 timestamp",
    "version": "API version"
  }
}
```

## License

MIT

## Support

For questions or suggestions about API conventions, refer to SKILL.md or ask Claude.
