import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "journeys",
      columns: [
        { name: "title", type: "string" },
        { name: "started_at", type: "number", isOptional: true },
        { name: "finished_at", type: "number", isOptional: true },
      ],
    }),
    tableSchema({
      name: "trips",
      columns: [
        { name: "title", type: "string" },
        { name: "started_at", type: "number", isOptional: true },
        { name: "finished_at", type: "number", isOptional: true },
        { name: "journey_id", type: "string", isIndexed: true },
      ],
    }),
  ],
});
