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
   ```bash
   npx expo run:android
   ```
   oder 
   ```bash
   npx expo run:ios
   ```
Um die App in einem Emulator oder auf einem physischen Gerät zu testen, siehe folgende Links:
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Testing
Die Tests werden pro Ordner gespeichert. Dafür wird in jedem Ordner ein `__tests__` Ordner erstellt. Darin werden die Dateien des Ordners getestet. Die Testdatei wird folgendermaßen benannt: `<moduleName>-test.ts` oder `<moduleName>-test.tsx`. 

### Aufbau einer Testdatei
#### Bei Unittests
```typescript
describe("<ModulName/Dateiname>", () => {
   describe("<einzelne Funktion oder Komponente>", () => {
      it("should <do something>", () => {
         // Initialisieren
         ...
         expect(<something>).toBe(<someValue>)
      })
   })
} )
```

#### Bei Komponententests
```typescript
import { render } from "@/test-utils/test-utils";
describe("<Komponentenname>", () => {
   it("should <render correclty,have these values, etc. >", () => {
      // Initialisieren
      ...
      const view = render(<Komponente>)
      expect(view).toMatchSnapshot();
      expect(<something>).toBe(<someValue>)
   })
} )
```

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
