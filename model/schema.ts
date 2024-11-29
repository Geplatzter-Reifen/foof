import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 6,
  tables: [
    tableSchema({
      name: "tours",
      columns: [
        { name: "title", type: "string" },
        { name: "is_active", type: "boolean" },
        { name: "started_at", type: "number", isOptional: true },
        { name: "finished_at", type: "number", isOptional: true },
      ],
    }),
    tableSchema({
      name: "stages",
      columns: [
        { name: "title", type: "string" },
        { name: "is_active", type: "boolean" },
        { name: "started_at", type: "number" },
        { name: "finished_at", type: "number", isOptional: true },
        { name: "distance", type: "number" },
        { name: "avg_speed", type: "number" },
        { name: "tour_id", type: "string", isIndexed: true },
      ],
    }),
    tableSchema({
      name: "locations",
      columns: [
        { name: "latitude", type: "number" },
        { name: "longitude", type: "number" },
        { name: "recorded_at", type: "number", isOptional: true },
        { name: "stage_id", type: "string", isIndexed: true },
      ],
    }),
    tableSchema({
      name: "routes",
      columns: [
        { name: "geojson", type: "string" },
        { name: "tour_id", type: "string", isIndexed: true, isOptional: true },
        { name: "stage_id", type: "string", isIndexed: true, isOptional: true },
      ],
    }),
  ],
});
