import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'board_games',
      columns: [
        { name: 'title', type: 'string', isIndexed: true }, // indexed means that we can search the column based on the title
        { name: 'min_players', type: 'number' },
      ],
    }),
  ],
});