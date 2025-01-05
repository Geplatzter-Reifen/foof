import TourStats from "../TourStats";
import { render, waitFor } from "@/test-utils/test-utils";
import { createTour } from "@/services/data/tourService";

describe("TourStats", () => {
  it("should render correctly", async () => {
    const tour = await createTour(
      "Mock Title",
      new Date("2024-12-03 12:00").getTime(),
    );
    let view;
    waitFor(() => {
      view = render(<TourStats tour={tour} />);
    });

    expect(view).toMatchSnapshot();
  });
  //TODO: Add more tests
});
