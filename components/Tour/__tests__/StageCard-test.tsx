import { createStage, getStageByStageId } from "@/services/data/stageService";
import StageCard from "../StageCard";
import { render } from "@/test-utils/test-utils";
import { createTour } from "@/services/data/tourService";

describe("<StageCard />", () => {
  test("renders correctly", async () => {
    const tour = await createTour("Test Tour");
    const stage = await createStage(
      tour.id,
      "Test Stage",
      Date.now(),
      undefined,
      true,
    );
    const view = render(<StageCard stage={stage.observe} />);
    expect(view).toMatchSnapshot();
  });
});
