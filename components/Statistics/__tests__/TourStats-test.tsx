import { MockTour } from "@/__mocks__/tour";
import TourStats from "../TourStats";
import { render, waitFor, act } from "@/test-utils/test-utils";

describe("TourStats", () => {
  beforeEach(() => {
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date("2024-12-17 10:00").getTime());
  });

  it("should render correctly", async () => {
    const tour = new MockTour();

    let view;
    // Hier wird eine Warning ausgegeben, dass soll aber anscheinend so
    await act(async () => {
      // @ts-ignore
      view = await waitFor(() => render(<TourStats tour={tour} />));
    });
    expect(view).toMatchSnapshot();
  });
  //TODO: Add more tests
});
