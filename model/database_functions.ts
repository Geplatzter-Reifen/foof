import {
  createTour,
  getAllTours,
  setTourActive,
} from "@/services/data/tourService";

export const initializeDatabase = async () => {
  let existingTour = await getAllTours();
  if (existingTour.length === 0) {
    let initial_tour = await createTour("Meine Tour");
    await setTourActive(initial_tour.id);
  }
};
