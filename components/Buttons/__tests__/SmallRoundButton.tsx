import { render } from "@/test-utils/test-utils";
import SmallIconButton from "../SmallIconButton";

describe("SmallIconButton", () => {
  it("renders correctly", () => {
    const view = render(<SmallIconButton icon={() => <></>} />);
    expect(view).toMatchSnapshot();
  });
});
