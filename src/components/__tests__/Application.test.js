import React from "react";

import { render,
    cleanup, 
    waitForElement, 
    getByText, 
    prettyDOM, 
    getAllByTestId, 
    getByAltText, 
    getByPlaceholderText,
    queryByText
  } from "@testing-library/react";

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

    // simulating a user booking an interview
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    // another way to look for text /enter student name/i - case insensitive
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(getByText(appointment, 'Save'));

    // console.log(debug())
    
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"))
    
    // as per compass answer - line not required
    // expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();
    
    const listEl = getAllByTestId(container, "day")
    // console.log(prettyDOM(listEl));
    const monday = listEl.find(eachDay => queryByText(eachDay, "Monday"))
    // can be refractored to one line:
    // const monday = getAllByTestId(container, 'day').find(eachDay => queryByText(eachDay, "Monday"))

    expect(getByText(monday, 'no spots remaining')).toBeInTheDocument();

  })
  
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // loads data, and select the appointment with the interview booked
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[1];
    // check to see that appointment contained an interview
    // console.log(prettyDOM(appointment));
    // trigger deleting event
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));
    // waiting for axios call to complete and the appointment renders create mode
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"))

    // confirm that appointment is no longer there
    // console.log(prettyDOM(appointment));

    // confirm that spots for the day has increased by 1
    // const listEl = getAllByTestId(container, "day")
    // const monday = listEl.find(eachDay => queryByText(eachDay, "Monday"))
    // // can be refractored to one line:
    const monday = getAllByTestId(container, 'day').find(eachDay => queryByText(eachDay, "Monday"))
    // console.log(prettyDOM(monday));

    // the other test affects how much spots is remaining - if the previous test is skipped use the line below
    // expect(getByText(monday, '2 spots remaining')).toBeInTheDocument();

    // if the other test is not skipped and both tests an ran - use this line
    expect(getByText(monday, '1 spot remaining')).toBeInTheDocument();

  })

})
