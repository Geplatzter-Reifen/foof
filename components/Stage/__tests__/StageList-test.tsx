import { createTour } from "@/services/data/tourService";
import { render } from "@/test-utils/test-utils";
import { StageListForTesting as StageList } from "@/components/Stage/StageList";
import {
  createStage,
  getAllStagesByTourId,
  setStageAvgSpeed,
  setStageDistance,
} from "@/services/data/stageService";
import { waitFor } from "@testing-library/react-native";

const createStageInTour = async (tourId: string) => {
  const stage = await createStage(
    tourId,
    "Test Stage",
    new Date("2024-01-01T10:30").getTime(),
    new Date("2024-01-01T17:45").getTime(),
    false,
  );
  await setStageDistance(stage.id, 56.98765);
  await setStageAvgSpeed(stage.id, 7.86036);

  return stage;
};

describe("StageList", () => {
  beforeEach(async () => {
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date("2024-01-01 21:00").getTime());
  });

  it("renders correctly for no existing stages", async () => {
    const tour = await createTour("Test Tour");
    const stages = await getAllStagesByTourId(tour.id);
    const view = await waitFor(() => render(<StageList stages={stages} />));
    expect(view).toMatchSnapshot();
  });

  it("renders correctly for one stage", async () => {
    const tour = await createTour("Test Tour");
    await createStageInTour(tour.id);
    const stages = await getAllStagesByTourId(tour.id);
    const view = await waitFor(() => render(<StageList stages={stages} />));
    expect(view).toMatchSnapshot();
  });

  it("renders correctly for many stages", async () => {
    const tour = await createTour("Test Tour");
    for (let i = 0; i < 6; i++) {
      await createStageInTour(tour.id);
    }
    const stages = await getAllStagesByTourId(tour.id);
    const view = await waitFor(() => render(<StageList stages={stages} />));
    expect(view).toMatchSnapshot();
    expect(view.getAllByTestId("stage-card")).toHaveLength(6);
  });
});
