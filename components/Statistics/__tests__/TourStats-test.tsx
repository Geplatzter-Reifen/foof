import TourStats from "../TourStats";
import { render, waitFor } from "@/test-utils/test-utils";
import { createTour } from "@/services/data/tourService";
import { createStage } from "@/services/data/stageService";

describe("TourStats", () => {
  beforeEach(() => {
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date("2024-01-03 17:30").getTime());
  });
  it("should render correctly", async () => {
    const tour = await createTour("Test");
    await createStage(
      tour.id,
      "Test1",
      new Date("2024-01-01T14:30:00").getTime(),
      new Date("2024-01-01T20:30:00").getTime(),
      false,
      110,
    );
    await createStage(
      tour.id,
      "Test2",
      new Date("2024-01-03T12:30:00").getTime(),
      undefined,
      true,
      90,
    );
    const view = await waitFor(() => render(<TourStats tour={tour} />));
    expect(view).toMatchSnapshot();
  });
  //TODO: Add more tests
});
