# 📱 Vehicle Inspection Mobile App

React Native + Expo mobile application for intelligent vehicle inspections.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update API URL if needed
# EXPO_PUBLIC_API_URL=your_backend_url
```

### Development

```bash
# Start Expo dev server
npm run start

# iOS (macOS only)
npm run ios

# Android
npm run android

# Web (for testing UI components)
npm run web
```

## 📁 Project Structure

```
src/
├── app/              # Expo Router screens and navigation
├── components/       # Reusable UI components
├── screens/          # Screen components
├── services/         # API and external services
├── store/            # Zustand state management
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── constants/        # App constants
└── assets/           # Images, icons, fonts
```

## 🎯 Features

### Authentication
- ✅ Login with email/password
- ✅ Register new user account
- ✅ JWT token persistence
- ✅ Auto-login on app start
- ✅ Logout functionality

### Inspections
- 📸 Capture photos (6 required angles)
- 🎥 Record inspection video
- 📍 Location tracking
- 🖊️ Digital signature
- 💾 Offline storage & sync
- ✅ Inspection validation

### Vehicles
- 🚗 List assigned vehicles
- 📊 View vehicle health score
- 📋 Inspection history
- 🔧 Maintenance alerts
- 📈 Performance metrics

### Dashboard
- 📊 Driver statistics
- ⛽ Fuel consumption
- 🛣️ Distance traveled
- ⏱️ Inspection time
- ⭐ Quality score

## 🔐 Security

- ✅ JWT token authentication
- ✅ Secure token storage (AsyncStorage)
- ✅ SSL/TLS for API calls
- ✅ Input validation
- ✅ Session timeout
- ✅ Automatic logout on 401

## 📦 Dependencies

- **React Native**: 0.72.0
- **Expo**: 49.0.0
- **Expo Router**: 2.0.0 (Navigation)
- **Axios**: 1.6.0 (HTTP client)
- **Zustand**: 4.4.0 (State management)
- **expo-camera**: 13.4.0 (Photo capture)
- **expo-location**: 16.1.0 (Geolocation)
- **expo-notifications**: 0.20.0 (Push notifications)

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Watch mode
npm run test:watch

# Type checking
npm run type-check
```

## 🛠️ Build for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Both platforms
eas build --platform all
```

## 📱 Platform-Specific Permissions

### iOS
- Camera access
- Location services
- Photo library access

### Android
- Camera permission
- Fine location permission
- Coarse location permission
- External storage read/write

## 🔗 API Integration

Base URL: `http://localhost:3000/api` (development)

All requests include JWT token in `Authorization: Bearer <token>` header.

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Run tests
4. Submit PR

---

**Status:** 🚀 Ready for development  
**Version:** 1.0.0  
**Stack:** React Native + Expo + TypeScript
