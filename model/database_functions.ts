import { database } from "./createDatabase";
import { Journey } from "./model";

const createJourney = async (title: string) =>
  await database.write(async () => {
    const journey = await database
      .get<Journey>("journeys")
      .create((journey) => {
        journey.title = title;
      });
    return journey;
  });

const createChain = async (journeyTitle: string) => {
  const journey = await createJourney(journeyTitle);
  const trip = await journey.addTrip("Trip 1");
  await trip.addLocation(0, 0);
};

const allJourneys = database.get<Journey>("journeys").query();

const deleteAllJourneys = () => {
  database.write(async () => {
    const journeys = await allJourneys.fetch();
    journeys.forEach((journey) => journey.destroyPermanently());
  });
};

export { createJourney, allJourneys, deleteAllJourneys, createChain };
