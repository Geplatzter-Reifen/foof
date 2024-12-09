# Willkommen im Foof Projekt

## Installation
1. Projekt clonen
   ```bash
   git clone https://github.com/Geplatzter-Reifen/foof
   ```

2. Pakete installieren
   ```bash
   npm install
   ```

2. Start the app
   ```bash
    npx expo start
   ```
   oder
   ```
   npx expo run:android
   ```
   oder 
    ```
   npx expo run:ios
   ```
Um die App in einem Emulator oder auf einem physischen Gerät zu testen, siehe folgende Links:
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Testing
### Nur geänderte Dateien Testen
   ```bash
   npm run test
   ```
### Zum Debuggen aber auch sonst ganz praktisch
   ```bash
   npm run testDebug
   ```
### Finales Testen mit Coverage Report, vor allem für die Pipeline
   ```bash
   npm run testFinal
   ```
### Für Änderungen an den Snapshots
   ```bash
   npm run updateSnapshot
   ```