// Nach dem Setup von Jest wird diese Datei geladen

import { database } from "./database/index";

// Lädt mehr Methoden zum Testen von React Komponenten
import "@testing-library/react-native/extend-expect";

afterEach(async () => {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
});
