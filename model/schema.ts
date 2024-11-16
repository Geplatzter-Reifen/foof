import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: "journeys",
      columns: [
        { name: "title", type: "string" },
        { name: "is_active", type: "boolean" },
        { name: "started_at", type: "number", isOptional: true },
        { name: "finished_at", type: "number", isOptional: true },
      ],
    }),
    tableSchema({
      name: "trips",
      columns: [
        { name: "title", type: "string" },
        { name: "is_active", type: "boolean" },
        { name: "started_at", type: "number" },
        { name: "finished_at", type: "number", isOptional: true },
        { name: "distance", type: "number" },
        { name: "journey_id", type: "string", isIndexed: true },
      ],
    }),
    tableSchema({
      name: "locations",
      columns: [
        { name: "latitude", type: "number" },
        { name: "longitude", type: "number" },
        { name: "recorded_at", type: "number", isOptional: true },
        { name: "trip_id", type: "string", isIndexed: true },
      ],
    }),
  ],
});
