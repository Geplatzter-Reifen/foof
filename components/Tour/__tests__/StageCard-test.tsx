import { render, screen } from "@/test-utils/test-utils";
import {
  createStage,
  setStageAvgSpeed,
  setStageDistance,
  startStage,
} from "@/services/data/stageService";
import { StageCardForTest as StageCard } from "../StageCard";
import { createTour } from "@/services/data/tourService";
import { createManualStage } from "@/services/tracking";
import { waitFor } from "@testing-library/react-native";

describe("StageCard", () => {
  beforeEach(() => {
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date("2024-01-01 21:00").getTime());
  });

  test("renders basic stage correctly", async () => {
    const tour = await createTour("Test Tour");
    const stage = await createStage(
      tour.id,
      "Basic Stage",
      new Date("2024-01-01T10:30").getTime(),
      new Date("2024-01-01T17:45").getTime(),
      false,
    );
    await setStageDistance(stage.id, 56.98765);
    await setStageAvgSpeed(stage.id, 7.86036);
    const view = await waitFor(() => render(<StageCard stage={stage} />));
    expect(view).toMatchSnapshot();
  });

  it("renders correctly for active stage", async () => {
    const tour = await createTour("Test Tour");
    const activeStage = await startStage(tour.id);
    const view = await waitFor(() => render(<StageCard stage={activeStage} />));
    expect(view).toMatchSnapshot();
    expect(screen.getByText("00:00 h")).toBeTruthy(); // seit erstellen (Date.now()) und Dauerberechnung (Date.now()) ist noch kaum Zeit vergangen
  });

  it("renders correctly for manually created stage", async () => {
    const tour = await createTour("Test Tour");
    const manualStage = await createManualStage(
      "Manual Stage",
      "50.3, 8.9",
      "50.8, 8.1",
      new Date("2024-12-03 8:13"),
      new Date("2024-12-03 16:49"),
      tour.id,
    );
    const view = await waitFor(() => render(<StageCard stage={manualStage} />));
    expect(view).toMatchSnapshot();
    expect(screen.getByText("79.3 km")).toBeTruthy();
    expect(screen.getByText("08:36 h")).toBeTruthy();
    expect(screen.getByText("9.2 km/h")).toBeTruthy();
  });
});
