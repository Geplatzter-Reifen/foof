import Touruebersicht from "..";
import { render } from "@/test-utils/test-utils";

describe("Touruebersicht", () => {
  it("should render correctly", async () => {
    //TODO create mock data
    const view = render(<Touruebersicht />);

    expect(view).toMatchSnapshot();
  });
  //TODO: Add more tests
});
