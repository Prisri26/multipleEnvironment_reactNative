# Base Project Multiple

A React Native mobile application built with Expo, featuring multiple environment configurations for development, QA, staging, and production.

## 🚀 Features

- Built with React Native and Expo
- Multiple environment configurations (Development, QA, Staging, Production)
- TypeScript support
- Expo Router for navigation
- Vector Icons integration
- Gesture handling support
- Safe area context management
- WebView support
- Blur effects
- Haptic feedback
- Image optimization
- Splash screen management

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## 🛠 Installation

1. Clone the repository:
```bash
git clone https://github.com/Prisri26/multipleEnvironment_reactNative
cd multipleEnvironment_reactNative
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Generate environment configurations:
```bash
npm run generate:env
# or
yarn generate:env
```

## 🏃‍♂️ Running the App

### Development

```bash
# Start development server
npm run start:dev
# or
yarn start:dev
```

### iOS

```bash
# Development
npm run ios:dev
# QA
npm run ios:qa
# Staging
npm run ios:stage
# Production
npm run ios:prod
```

### Android

```bash
# Development
npm run android:dev
# QA
npm run android:qa
# Staging
npm run android:stage
# Production
npm run android:prod
```

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset project configuration
- `npm run generate:images` - Generate image assets
- `npm run android:release` - Generate Android release build

## 🏗 Project Structure

```
baseprojectmultiple/
├── app/                 # Main application code
├── assets/             # Static assets
├── components/         # Reusable components
├── constants/          # Constants and configuration
├── hooks/              # Custom React hooks
├── scripts/            # Build and utility scripts
└── src/               # Source code
```

## 🔧 Environment Configuration

The project supports multiple environments:
- Development
- QA
- Staging
- Production

Environment-specific configurations can be set using the `EXPO_PUBLIC_ENV` variable.

## 📦 Dependencies

Key dependencies include:
- expo: ~53.0.10
- react: 19.0.0
- react-native: 0.79.3
- expo-router: ~5.0.7
- react-native-gesture-handler: ~2.24.0
- react-native-reanimated: ~3.17.4

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Authors

- Prithivirajan C - Initial work

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
