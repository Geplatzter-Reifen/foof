import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { BoardGame } from './model';
import { schema } from './schema';
import { Platform } from 'react-native';

const useJsi = Platform.OS === 'ios';

const adapter = new SQLiteAdapter({
  schema,
  jsi: useJsi,
});

export const database = new Database({
  adapter,
  modelClasses: [BoardGame],
});
// database.write(() => database.unsafeResetDatabase()); // Für Troubleshooting mit der Datenbank
