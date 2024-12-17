import { MockTour } from "@/__mocks__/tour";
import TourStats from "../TourStats";
import { render } from "@/test-utils/test-utils";

describe("TourStats", () => {
  it("should render correctly", async () => {
    const tour = new MockTour();

    // Hier wird eine Warning ausgegeben, dass soll aber anscheinend so
    // @ts-ignore
    const view = render(<TourStats tour={tour} />);

    expect(view).toMatchSnapshot();
  });
  //TODO: Add more tests
});
