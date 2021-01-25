import React from "react";

import { render, cleanup, waitForElement } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

afterEach(cleanup);

it("defaults to Monday and changes the schedule whena new day is selected", () => {
  const { getByText } = render(<Application />);

  return waitForElement(()=> getByText("Monday"))
    .then(() => {
      fireEvent.click(getByText('Tuesday'));
      expect(getByText('Leopold Silvers')).toBeInTheDocument()
    }
  )
});
