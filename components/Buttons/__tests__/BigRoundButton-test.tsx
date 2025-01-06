import { render } from "@/test-utils/test-utils";
import BigRoundButton from "../BigRoundButton";

describe("BigRoundButton", () => {
  it("renders correctly", () => {
    const view = render(<BigRoundButton icon={() => <></>} />);
    expect(view).toMatchSnapshot();
  });
});
