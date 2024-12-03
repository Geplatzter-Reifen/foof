import { render } from "@/test-utils/test-utils";
import { CreateManualStageModal } from "../CreateManualStageModal";

// Ich vermute das dieser Test nicht mehr nötig ist, da die Komponente nicht mehr existiert.
describe("<CreateManualStageModal />", () => {
  it("should render correctly", () => {
    const view = render(
      <CreateManualStageModal
        isVisible={true}
        onClose={jest.fn()}
        tourId="1"
      />,
    );
    expect(view).toMatchSnapshot();
  });
});
