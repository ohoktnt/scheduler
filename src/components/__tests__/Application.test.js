import React from "react";
// mocking a mock - axios
import axios from "axios";

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

    // trigger deleting event
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));
    // waiting for axios call to complete and the appointment renders create mode
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"))

    // confirm that spots for the day has increased by 1
    const monday = getAllByTestId(container, 'day').find(eachDay => queryByText(eachDay, "Monday"))
    // console.log(prettyDOM(monday));

    // the other test affects how much spots is remaining - if the previous test is skipped use the line below
    // expect(getByText(monday, '2 spots remaining')).toBeInTheDocument();

    // if the other test is not skipped and both tests are ran - use this line
    expect(getByText(monday, '1 spot remaining')).toBeInTheDocument();
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // loads data, and select the appointment with the interview booked to be edited
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // const appointment = getAllByTestId(container, "appointment").find(
    //   appointment => queryByText(appointment, "Archie Cohen")
    // );

    const appointment = getAllByTestId(container, "appointment")[1]

    // console.log(prettyDOM(appointment))

    // trigger editing event
    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"))
    
    // console.log(prettyDOM(appointment))

    // // confirm that spots for the day has not changed
    const monday = getAllByTestId(container, 'day').find(eachDay => queryByText(eachDay, "Monday"));

    // if the other tests is not skipped and both tests are ran - use this line
    expect(getByText(monday, '1 spot remaining')).toBeInTheDocument();
    
    // the other test affects how much spots is remaining - if the previous test is skipped use the line below
    // expect(getByText(monday, '2 spots remaining')).toBeInTheDocument();
  })

  it("shows the save error when failing to save an apppointment", async () => {
    axios.put.mockRejectedValueOnce();
    
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

    await waitForElement(() => getByText(appointment, "Error"))

    expect(getByText(appointment, "Error")).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByAltText(appointment, "Add"))

    // console.log(prettyDOM(appointment))
    
  })
  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce()
    // loads data, and select the appointment with the interview booked
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[1];
  
    // trigger deleting event
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
  
    fireEvent.click(getByText(appointment, "Confirm"));
    // waiting for axios call to complete and the appointment renders create mode
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Error"))

    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByText(appointment, "Archie Cohen"))

    // console.log(prettyDOM(appointment))
  })

})
