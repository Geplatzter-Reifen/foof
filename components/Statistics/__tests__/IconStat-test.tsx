import { render } from "@/test-utils/test-utils";
import IconStat from "@/components/Statistics/IconStat";
import { foofLightTheme, foofTheme } from "@/constants/custom-theme";

describe("TourStats", () => {
  it("should render the correct icon", async () => {
    const view = render(<IconStat icon="home">1001km</IconStat>);
    expect(view).toMatchSnapshot();
  });
  it("should render the icon and font in correct size", () => {
    const view = render(
      <IconStat icon="home" iconSize={30} fontSize={21}>
        1001km
      </IconStat>,
    );
    expect(view).toMatchSnapshot();
  });
  describe("should render the correct icon color depending on the given status", () => {
    test("primary", () => {
      const { getByTestId } = render(<IconStat icon="home" status="primary" />);
      const view = getByTestId("container");
      const icon = view.props.children[0];
      expect(icon.props.style.color).toBe(foofTheme["color-primary-500"]);
    });
    test("basic", () => {
      const { getByTestId } = render(<IconStat icon="home" status="basic" />);
      const view = getByTestId("container");
      const icon = view.props.children[0];
      expect(icon.props.style.color).toBe(foofTheme["color-basic-500"]);
    });
    test("success", () => {
      const { getByTestId } = render(<IconStat icon="home" status="success" />);
      const view = getByTestId("container");
      const icon = view.props.children[0];
      expect(icon.props.style.color).toBe(foofTheme["color-success-500"]);
    });
    test("info", () => {
      const { getByTestId } = render(<IconStat icon="home" status="info" />);
      const view = getByTestId("container");
      const icon = view.props.children[0];
      expect(icon.props.style.color).toBe(foofTheme["color-info-500"]);
    });
    test("warning", () => {
      const { getByTestId } = render(<IconStat icon="home" status="warning" />);
      const view = getByTestId("container");
      const icon = view.props.children[0];
      expect(icon.props.style.color).toBe(foofTheme["color-warning-500"]);
    });
    test("danger", () => {
      const { getByTestId } = render(<IconStat icon="home" status="danger" />);
      const view = getByTestId("container");
      const icon = view.props.children[0];
      expect(icon.props.style.color).toBe(foofTheme["color-danger-500"]);
    });
    test("text", () => {
      const { getByTestId } = render(<IconStat icon="home" status="text" />);
      const view = getByTestId("container");
      const icon = view.props.children[0];
      expect(icon.props.style.color).toBe(foofLightTheme["text-basic-color"]); // wäre im Darkmode das andere Theme
    });
    test("incorrect syntax should render primary color", () => {
      const { getByTestId } = render(<IconStat icon="home" status="xyz" />);
      const view = getByTestId("container");
      const icon = view.props.children[0];
      expect(icon.props.style.color).toBe(foofTheme["color-primary-500"]);
    });
    test("no given status should render primary color", () => {
      const { getByTestId } = render(<IconStat icon="home" />);
      const view = getByTestId("container");
      const icon = view.props.children[0];
      expect(icon.props.style.color).toBe(foofTheme["color-primary-500"]);
    });
  });
});
