import { database } from "./createDatabase";
import { Journey } from "./model";

const createJourney = (title: string) =>
  database.write(() =>
    database.get<Journey>("journeys").create((journey) => {
      journey.title = title;
    }),
  );

const journeyQuery = database.get<Journey>("journeys").query();

const deleteAllJourneys = () => {
  database.write(journeyQuery.destroyAllPermanently);
};

export { createJourney, journeyQuery, deleteAllJourneys };
