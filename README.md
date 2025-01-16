# Willkommen im Foof Projekt

## Installation

### Voraussetzungen
- [Node.js (LTS)](https://nodejs.org/en/)
- (MacOS) [Homebrew](https://brew.sh/)

#### Android
- [Android Studio](https://developer.android.com/studio)
- [JDK 17](https://adoptium.net/de/temurin/releases/?version=17&package=jdk)

#### iOS (nur auf MacOS)
- [Xcode](https://apps.apple.com/us/app/xcode/id497799835)
- [XCode Command Line Tools](https://developer.apple.com/xcode/resources/) `xcode-select --install`
- [Watchman](https://facebook.github.io/watchman/docs/install#macos) `brew install watchman`

1. Projekt klonen
   ```bash
   git clone https://github.com/Geplatzter-Reifen/foof
   ```

2. Environment Variablen ausfüllen
   ```bash
   cp .env.example .env
   ```
   [EXPO_PUBLIC_MAPBOX_API_KEY](https://docs.mapbox.com/help/getting-started/access-tokens/#public-tokens)
   <br><br>

3. Pakete installieren
   ```bash
   npm install
   ```

### App in einem Emulator, Simulator oder auf einem physischen Gerät installieren und starten
   Android:
   ```bash
   npx expo run:android
   ```
   iOS:
   ```bash
   npx expo run:ios
   ```

### APK erstellen
   ```bash
   npx expo prebuild --platform android
   ```
   ```bash
   cd android
   ```
   Release APK:
   ```bash
    ./gradlew assembleRelease
   ```
   Debug APK:
   ```bash
   ./gradlew assembleDebug
   ```
Die APK befindet sich danach in `android/app/build/outputs/apk`.

Um die App in einem Emulator oder auf einem physischen Gerät zu testen, siehe folgende Links:
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
