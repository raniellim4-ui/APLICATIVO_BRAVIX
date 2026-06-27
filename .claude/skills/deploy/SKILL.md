---
name: deploy
description: Deploy the application to production
disable-model-invocation: true
---

# Deploy

Automated deployment workflow for production releases with verification.

## Deployment Steps

Deploy $ARGUMENTS to production:

1. **Run the test suite** — Verify all tests pass
2. **Build the application** — Compile and optimize code
3. **Push to the deployment target** — Upload to production
4. **Verify the deployment succeeded** — Confirm health and functionality

## Step 1: Run the Test Suite

```bash
npm test
```

**Validates:**
- All unit tests pass
- Integration tests succeed
- Code coverage meets threshold
- No regressions detected

**On failure:** Stop and report test failures

## Step 2: Build the Application

```bash
npm run build
```

**Produces:**
- Compiled TypeScript/JavaScript
- Bundled and optimized assets
- Minified code
- Production artifacts in `dist/` or `build/`

**On failure:** Stop and report build errors

## Step 3: Push to Deployment Target

```bash
npm run deploy
```

**Actions:**
- Upload artifacts to production
- Update environment configuration
- Run database migrations (if needed)
- Initialize production services

**Supports:**
- AWS (EC2, Lambda, Elastic Beanstalk)
- Vercel, Netlify
- Docker, Heroku
- Custom servers

## Step 4: Verify the Deployment Succeeded

```bash
npm run verify
```

**Checks:**
- Application starts without errors
- All endpoints respond correctly
- Database connections functional
- Cache layers operational
- External services reachable
- Performance metrics normal
- Error rates acceptable

**On failure:** Trigger automatic rollback

## Usage

**Basic deployment:**
```bash
claude deploy
```

**With arguments:**
```bash
claude deploy --environment=production
claude deploy --target=aws
claude deploy --skip-tests
```

## Prerequisites

Before deploying:
- ✅ All tests passing locally
- ✅ Code reviewed and approved
- ✅ Changes committed and pushed
- ✅ CI/CD pipeline passed
- ✅ Environment variables configured
- ✅ Backups created
- ✅ Team notified

## Configuration

**Required environment variables:**
```env
DEPLOYMENT_TARGET=production
API_KEY=your-api-key
ENVIRONMENT=production
```

## Rollback

If verification fails, automatic rollback occurs:
```bash
npm run rollback
```

## Model Invocation

Model invocation is disabled (`disable-model-invocation: true`). This skill executes commands directly without AI analysis.
