import { MockTour } from "@/__mocks__/tour";
import TourStats from "../TourStats";
import { render, waitFor } from "@/test-utils/test-utils";

describe("TourStats", () => {
  beforeEach(() => {
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date("2024-12-17 10:00").getTime());
  });

  it("should render correctly", async () => {
    const tour = new MockTour();

    // Hier wird eine Warning ausgegeben, dass soll aber anscheinend so
    // @ts-ignore
    const view = await waitFor(() => render(<TourStats tour={tour} />));
    expect(view).toMatchSnapshot();
  });
  //TODO: Add more tests
});
