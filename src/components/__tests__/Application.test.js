import React from "react";

import { render, cleanup, waitForElement, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

afterEach(cleanup);

// it("defaults to Monday and changes the schedule whena new day is selected", () => {
//   const { getByText } = render(<Application />);

//   return waitForElement(()=> getByText("Monday"))
//     .then(() => {
//       fireEvent.click(getByText('Tuesday'));
//       expect(getByText('Leopold Silvers')).toBeInTheDocument()
//     }
//   )

// });

describe("Application", () => {

  // using new syntax from ECMAScript 2017
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText('Tuesday'));
    expect(getByText('Leopold Silvers')).toBeInTheDocument()
    
  })
  
  it("loads data, books an interview, and reduces the spots remaining for the first day by 1", async () => {
    
    const { container } = render(<Application />);
    
    await waitForElement(()=> getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    // or do this
    // const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))

    fireEvent.click(getByText(appointment, 'Save'));

    console.log(prettyDOM(appointment));

  })
  

})





// fireEvent.click(getByText(""))