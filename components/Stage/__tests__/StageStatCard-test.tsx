import { render } from "@/test-utils/test-utils";
import { fetchPlaceName } from "@/services/geoService";
import StageStatCard from "@/components/Stage/StageStatCard";
import { createTour } from "@/services/data/tourService";
import {
  createStage,
  setStageAvgSpeed,
  setStageDistance,
} from "@/services/data/stageService";
import { waitFor } from "@testing-library/react-native";
import {
  createLocation,
  getAllLocationsByStageId,
} from "@/services/data/locationService";
import { MockStage } from "@/__mocks__/stage";

jest.mock("../../../services/geoService", () => ({
  fetchPlaceName: jest.fn(),
}));

describe("StageStatCard", () => {
  beforeEach(() => {
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date("2024-12-03 19:21").getTime());
  });

  it("does not render Start and End Point for Stage with less than two Locations", () => {
    const stage = new MockStage();

    // @ts-ignore - TS mag die MockStage nicht
    const view = render(<StageStatCard stage={stage} locations={[]} />);
    expect(view).toMatchSnapshot();
  });

  it("renders correctly", async () => {
    (fetchPlaceName as jest.Mock).mockResolvedValueOnce("Startpunkt");
    (fetchPlaceName as jest.Mock).mockResolvedValueOnce("Endpunkt");

    const tour = await createTour("Test Tour");
    const stage = await createStage(
      tour.id,
      "Basic Stage",
      new Date("2024-12-01T10:28").getTime(),
      new Date("2024-12-01T17:43").getTime(),
      false,
    );
    await setStageDistance(stage.id, 79.345);
    await setStageAvgSpeed(stage.id, 10.9379);
    await createLocation(
      stage.id,
      50.3,
      8.9,
      new Date("2024-12-01T10:28").getTime(),
    );
    await createLocation(
      stage.id,
      50.8,
      8.1,
      new Date("2024-12-01T17:43").getTime(),
    );
    const locations = await getAllLocationsByStageId(stage.id);

    const view = await waitFor(() =>
      render(<StageStatCard stage={stage} locations={locations} />),
    );
    expect(view).toMatchSnapshot();
    // korrektes Datum
    expect(view.getByText("vom 01.12.2024")).toBeTruthy();
    // korrekte Start- und Zielzeit
    expect(view.getByText("10:28")).toBeTruthy();
    expect(view.getByText("17:43")).toBeTruthy();
    // korrekter Start- und Zielort
    expect(view.getByText("Startpunkt")).toBeTruthy();
    expect(view.getByText("Endpunkt")).toBeTruthy();
    // korrekte Statistiken
    expect(view.getByText("79.3 km")).toBeTruthy();
    expect(view.getByText("7h 15m")).toBeTruthy();
    expect(view.getByText("10.9 km/h")).toBeTruthy();
  });
});
