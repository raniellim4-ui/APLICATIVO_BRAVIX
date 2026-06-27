# Deploy Skill

Automated deployment workflow for production releases with safety checks and rollback capabilities.

## Overview

This skill provides a structured, three-step deployment process:

1. **Test** — Run test suite to ensure quality
2. **Build** — Compile and optimize application
3. **Deploy** — Push to production and verify

## Key Features

- ✅ Automated test verification
- 🏗️ Production build process
- 🚀 Safe deployment with rollback
- 📊 Health checks and monitoring
- 🔒 Security best practices
- 📝 Deployment checklist
- 🛑 Rollback on failure

## Installation

```bash
npx skills add ~/.claude/skills/deploy
```

## Prerequisites

Before deploying, ensure:

1. **All tests pass** locally
   ```bash
   npm test
   ```

2. **Application builds** without errors
   ```bash
   npm run build
   ```

3. **Code is committed** and pushed
   ```bash
   git push origin feature-branch
   ```

4. **Environment variables** are configured
   ```bash
   .env.production
   ```

## Usage

**Deploy from CLI:**
```bash
npm run deploy
```

**Deploy with Claude:**
```bash
claude deploy
```

## Deployment Process

### Step 1: Test Suite
- Runs all unit tests
- Executes integration tests
- Verifies code coverage
- Aborts on test failure

### Step 2: Build
- Compiles TypeScript/JavaScript
- Bundles and optimizes assets
- Minifies code
- Generates production artifacts in `dist/`

### Step 3: Deploy
- Uploads to production server
- Updates environment configuration
- Runs database migrations (if applicable)
- Verifies deployment health

## Configuration

### Required Environment Variables

```env
DEPLOYMENT_TARGET=production-server.com
API_KEY=your-api-key-here
ENVIRONMENT=production
LOG_LEVEL=info
```

### Deployment Targets

Supports multiple deployment targets:
- **AWS** - EC2, Lambda, Elastic Beanstalk
- **Vercel** - Next.js/Node.js hosting
- **Netlify** - Static and serverless
- **Docker** - Container registries
- **Heroku** - PaaS platforms
- **Custom** - Self-hosted servers

## Rollback

If deployment fails or issues are detected:

```bash
npm run rollback
```

This reverts to the previous stable version immediately.

## Safety Features

- ✅ Test verification before build
- ✅ Build verification before deploy
- ✅ Health checks post-deployment
- ✅ Automatic rollback on failure
- ✅ Deployment logging and audit trails
- ✅ Fork context isolation
- ✅ Approval requirement for production

## Monitoring After Deployment

**Critical checks:**
1. Application starts without errors
2. API endpoints respond correctly
3. Database connections work
4. Cache layers are functional
5. External services are reachable
6. Performance metrics are normal
7. Error rates are acceptable

**Tools to monitor:**
- Application logs (CloudWatch, Stackdriver)
- Error tracking (Sentry, Rollbar)
- APM (New Relic, DataDog)
- Uptime monitoring (Pingdom, UptimeRobot)

## Deployment Checklist

Before deploying, complete this checklist:

- [ ] All tests passing locally
- [ ] Code review completed
- [ ] PR merged to main/master
- [ ] CI/CD pipeline passed
- [ ] Environment variables set
- [ ] Database backups created
- [ ] Rollback plan documented
- [ ] Team notified of deployment
- [ ] Monitoring and alerts enabled
- [ ] Documentation updated

## Troubleshooting

### Tests Failing
```bash
npm test -- --verbose
# Fix failing tests
npm test
```

### Build Errors
```bash
rm -rf node_modules dist/
npm install
npm run build
```

### Deployment Timeout
- Check server connectivity
- Verify credentials
- Review logs: `cat deployment.log`
- Try rollback if needed

### Health Check Failures
```bash
# Check deployment logs
npm run logs

# Manual health check
curl https://your-app.com/health

# Rollback if critical
npm run rollback
```

## Skill Configuration

- **Context:** `fork` — Isolated execution environment
- **Model Invocation:** Disabled — Executes commands directly
- **Timeout:** 10 minutes (600 seconds)
- **Approval Required:** Yes — Manual confirmation needed

## Security Best Practices

1. **Never commit secrets**
   - Use `.env.production` (gitignored)
   - Store in environment variables
   - Use secret manager services

2. **Verify deployment target**
   - Use HTTPS only
   - Verify SSL certificates
   - Check server authenticity

3. **Audit deployments**
   - Keep deployment logs
   - Track who deployed what
   - Monitor for unauthorized changes

4. **Keep updated**
   - Update Node.js regularly
   - Update dependencies
   - Update deployment scripts

## Support

For deployment issues, refer to SKILL.md or contact your DevOps team.

## License

MIT
