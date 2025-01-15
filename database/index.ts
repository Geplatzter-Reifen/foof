import { Database } from "@nozbe/watermelondb";

import { Tour, Stage, Location, Route } from "./model/model";
import adapter from "./adapter";

export const database = new Database({
  adapter,
  modelClasses: [Tour, Stage, Location, Route],
});
// database.write(() => database.unsafeResetDatabase()); // Comment in to reset the database
