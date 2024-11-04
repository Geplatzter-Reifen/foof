import { database } from "./createDatabase";
import { BoardGame } from "./model";

const createBoardGame = (title: string, minPlayers: number) =>
  database.write(() =>
    database.get<BoardGame>("board_games").create((boardGame) => {
      boardGame.title = title;
      boardGame.minPlayers = minPlayers;
    }),
  );
const gamesQuery = database.get<BoardGame>("board_games").query();
const deleteAllBoardGames = () => {
  database.write(gamesQuery.destroyAllPermanently);
};

export { createBoardGame, gamesQuery, deleteAllBoardGames };
