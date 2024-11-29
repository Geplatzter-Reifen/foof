import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { Tour, Stage, Location, Route } from "./model";
import { schema } from "./schema";
import { Platform } from "react-native";

const useJsi = Platform.OS === "ios"; // Nicht ganz sicher, ob das nicht auch für alle Plattformen geht

const adapter = new SQLiteAdapter({
  schema,
  jsi: useJsi,
});

export const database = new Database({
  adapter,
  modelClasses: [Tour, Stage, Location, Route],
});
// database.write(() => database.unsafeResetDatabase()); // Für Troubleshooting mit der Datenbank
