import { render } from "@/test-utils/test-utils";
import { CreateManualStageModal } from "../CreateManualStageModal";

describe("<CreateManualStageModal />", () => {
  it("should render correctly", () => {
    const view = render(
      <CreateManualStageModal isVisible onClose={jest.fn()} tourId="1" />,
    );
    expect(view).toMatchSnapshot();
  });
});
