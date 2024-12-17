import { render } from "@/test-utils/test-utils";
import SmallRoundButton from "../SmallRoundButton";
import React from "react";

describe("SmallRoundButton", () => {
  it("renders correctly", () => {
    const view = render(<SmallRoundButton icon={() => <></>} />);
    expect(view).toMatchSnapshot();
  });
});
