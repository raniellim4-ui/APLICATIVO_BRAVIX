# 🎛️ Vehicle Inspection Admin Dashboard

Professional Next.js admin dashboard for managing vehicle fleet inspections.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update API URL if needed
# NEXT_PUBLIC_API_URL=your_backend_url
```

### Development

```bash
# Start dev server (port 3001)
npm run dev

# Open http://localhost:3001
```

## 📁 Project Structure

```
pages/
├── _app.tsx            # App wrapper
├── _document.tsx       # Document setup
├── index.tsx           # Dashboard home
├── login.tsx           # Authentication
├── vehicles/           # Vehicle management
│   ├── index.tsx       # Vehicle list
│   └── [id].tsx        # Vehicle details
├── drivers/            # Driver management
├── inspections/        # Inspection records
├── analytics/          # Analytics & reports
└── settings/           # Admin settings

components/
├── Layout/             # Layout wrapper
├── Dashboard/          # Dashboard widgets
├── VehicleTable/       # Vehicle table component
├── Charts/             # Chart components
└── shared/             # Shared components

lib/
├── api.ts              # API client
├── auth.ts             # Authentication
└── utils.ts            # Utilities

styles/
├── globals.css         # Global styles
└── variables.css       # CSS variables
```

## 🎯 Features

### Dashboard
- 📊 Fleet overview metrics
- 🚗 Active vehicles status
- 👥 Driver performance
- 📈 Inspection trends
- ⚠️ Alerts and maintenance due

### Vehicle Management
- 📋 List all vehicles
- 🔍 Search and filter
- 📊 Vehicle health scores
- 📸 Inspection photos
- 🔧 Maintenance history
- 📍 Real-time tracking

### Driver Management
- 👥 Driver list
- 📊 Performance metrics
- 📅 Inspection history
- ⏱️ Average inspection time
- ⭐ Quality scores
- 🚫 Infractions tracking

### Inspections
- 📋 Inspection records
- 🖼️ Photo gallery
- 📊 Damage reports
- ✅ Compliance status
- 🔄 Inspection history
- 📥 Export reports

### Analytics & Reports
- 📈 Fleet analytics
- 📊 Driver performance graphs
- 💰 Cost analysis
- 🎯 KPI dashboard
- 📅 Time-based reports
- 📥 Export to PDF/CSV

### Admin Settings
- 👤 User management
- 🔐 Role permissions
- ⚙️ System configuration
- 📧 Notification settings
- 🎨 Theme customization
- 📊 Audit logs

## 🔐 Authentication

- JWT token-based auth
- Session persistence
- Auto-logout on 401
- Role-based access control
- NextAuth.js ready

## 🎨 UI/UX

- Responsive design
- Dark mode support
- Accessible components (shadcn/ui)
- Smooth animations
- Mobile-friendly
- Fast performance

## 📦 Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **State**: Zustand
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Auth**: NextAuth.js ready

## 🚀 Build for Production

```bash
# Build
npm run build

# Start production server
npm run start
```

## 📊 Performance

- ⚡ Fast page loads
- 🔄 Server-side rendering
- 📦 Code splitting
- 🖼️ Image optimization
- 💾 API caching
- 📱 Mobile optimized

## 🧪 Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch
```

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query)

---

**Status:** 🚀 Ready for development  
**Version:** 1.0.0  
**Stack:** Next.js 14 + TypeScript + Tailwind
