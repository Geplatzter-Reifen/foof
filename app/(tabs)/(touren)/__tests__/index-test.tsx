import Touruebersicht from "..";
import { render } from "@/test-utils/test-utils";
import { createTour, setTourActive } from "@/services/data/tourService";
import { waitFor } from "@testing-library/react-native";

describe("Touruebersicht", () => {
  it("should render correctly", async () => {
    const tour = await createTour("Coole Tour");
    await setTourActive(tour.id);
    const view = await waitFor(() => render(<Touruebersicht />));

    expect(view).toMatchSnapshot();
  });
  // Mehr Tests braucht es nicht, da dafür bereits Tests der Unterkomponenten existieren (TourStats, StageList)
  // Deshalb hier auch keine besonderen Testdaten
});
