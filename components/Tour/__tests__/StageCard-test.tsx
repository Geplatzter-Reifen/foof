import { createStage } from "@/services/data/stageService";
import StageCard from "../StageCard";
import { render } from "@/test-utils/test-utils";
import { createTour } from "@/services/data/tourService";

describe("<StageCard />", () => {
  test("renders correctly", async () => {
    const tour = await createTour("Test Tour");
    const stage = await createStage(
      tour.id,
      "Test Stage",
      new Date("2024-11-29T20:30:00.000").getTime(),
      undefined,
      true,
    );
    const view = render(<StageCard stage={stage} />);
    expect(view).toMatchSnapshot();
  });
});
