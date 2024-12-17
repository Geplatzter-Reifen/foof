import { render, waitFor, act } from "@/test-utils/test-utils";
import { TourProgressBar } from "@/components/Statistics/TourProgressBar";

describe("TourProgressBar", () => {
  it("renders correctly for 0 Percent", async () => {
    let bar;
    await act(async () => {
      bar = await waitFor(() => render(<TourProgressBar progress={0} />));
    });
    expect(bar).toMatchSnapshot();
  });
  // it("renders correctly for < 18% Percent", async () => {
  //   const bar = await waitFor(() =>
  //     render(<TourProgressBar progress={0.175} />),
  //   );
  //   expect(bar).toMatchSnapshot();
  // });
  // it("renders correctly for 18% Percent", async () => {
  //   const bar = await waitFor(() =>
  //     render(<TourProgressBar progress={0.18} />),
  //   );
  //   expect(bar).toMatchSnapshot();
  // });
  // it("renders correctly for > 18% Percent", async () => {
  //   const bar = await waitFor(() =>
  //     render(<TourProgressBar progress={0.543} />),
  //   );
  //   expect(bar).toMatchSnapshot();
  // });
  // it("renders correctly for 100% Percent", async () => {
  //   const bar = await waitFor(() => render(<TourProgressBar progress={1} />));
  //   expect(bar).toMatchSnapshot();
  // });
  // it("renders correctly for > 100% Percent", async () => {
  //   const bar = await waitFor(() =>
  //     render(<TourProgressBar progress={1.234} />),
  //   );
  //   expect(bar).toMatchSnapshot();
  // });
});
