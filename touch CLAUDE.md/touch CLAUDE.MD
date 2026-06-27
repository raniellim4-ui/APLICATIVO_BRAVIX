# CLAUDE.md

## Project Identity

You are working on a professional enterprise-grade fleet checklist system.

The system includes:
- Mobile app for employees and drivers
- Admin dashboard for managers
- Backend API
- PostgreSQL database
- Authentication and permissions
- Vehicle checklist workflows
- Photo evidence
- Offline-first mobile support
- Maintenance orders
- Audit logs
- Reports
- Security and compliance

## Engineering Standard

Always work as a senior software engineer.

Do not generate amateur code.

Follow:
- Clean Architecture
- Domain-driven modular structure
- TypeScript strict mode
- Testable services
- Explicit DTOs
- Zod validation where useful
- Prisma database modeling
- RBAC permissions
- Audit logging
- Error handling
- Structured logs
- Unit and integration tests
- Documentation before complex implementation

## Stack

Mobile:
- React Native
- Expo
- TypeScript
- React Hook Form
- Zod
- TanStack Query
- Zustand
- Offline sync

Admin:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Table
- Charts
- Role-based access

Backend:
- NestJS
- TypeScript
- PostgreSQL
- Prisma
- JWT
- Refresh Token
- RBAC
- Swagger
- Redis
- BullMQ
- Jest

Infra:
- Docker
- GitHub Actions
- Staging and production environments
- Monitoring
- Backups
- Logs

## Work Rules

Before coding:
1. Understand the feature
2. Check existing architecture
3. Identify impacted files
4. Propose the plan
5. Wait only if there is destructive risk

When coding:
1. Create small changes
2. Keep modules separated
3. Avoid duplicated logic
4. Add validation
5. Add tests
6. Update documentation

After coding:
1. Run lint
2. Run tests
3. Explain what changed
4. List next steps

## Forbidden

Do not:
- Create everything in one file
- Skip validation
- Skip tests
- Hardcode secrets
- Put business logic inside controllers
- Mix mobile logic with backend logic
- Create fake security
- Create unclear names
- Ignore errors
- Ignore audit logs
