import { render } from "@/test-utils/test-utils";
import BigRoundButton from "../BigRoundButton";
import React from "react";

describe("BigRoundButton", () => {
  it("renders correctly", () => {
    const view = render(<BigRoundButton icon={() => <></>} />);
    expect(view).toMatchSnapshot();
  });
});
