import React from "react";

// mocking axios for error testing
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

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText('Tuesday'));
    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });
  
  it("loads data, books an interview, and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(()=> getByText(container, "Archie Cohen"));

    // selecting the an empty appointment slot
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // simulating a user booking an interview
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, 'Save'));

    // confirm that the interview saved
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // check to see that spots have updated
    const monday = getAllByTestId(container, 'day').find(eachDay => queryByText(eachDay, "Monday"));
    expect(getByText(monday, 'no spots remaining')).toBeInTheDocument();
  });
  
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // select the appointment with the interview booked
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[1];

    // trigger deleting event
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));

    // confirm that the interivew was cancelled
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"));

    // confirm that spots for the day has increased by 1
    const monday = getAllByTestId(container, 'day').find(eachDay => queryByText(eachDay, "Monday"));
    
    // if the other test is not skipped and both tests are ran - use this line
    expect(getByText(monday, '1 spot remaining')).toBeInTheDocument();

    // the other test affects how much spots is remaining - if the previous test is skipped use the line below
    // expect(getByText(monday, '2 spots remaining')).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // select the appointment with the interview booked to be edited
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[1];

    // trigger editing event
    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    
    // confirm that interview was edited 
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // confirm that spots for the day has not changed
    const monday = getAllByTestId(container, 'day').find(eachDay => queryByText(eachDay, "Monday"));

    // if the other tests is not skipped and both tests above are ran - use this line
    expect(getByText(monday, '1 spot remaining')).toBeInTheDocument();
    
    // the other test affects how much spots is remaining - if the previous tests is skipped use the line below
    // expect(getByText(monday, '2 spots remaining')).toBeInTheDocument();
  });

  it("shows the save error when failing to save an apppointment", async () => {
    // mock the error
    axios.put.mockRejectedValueOnce();
    
    // select the appointment to have an interview booked
    const { container } = render(<Application />);
    await waitForElement(()=> getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    
    // simulating a user booking an interview
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, 'Save'));

    // confirm that error message was sent
    await waitForElement(() => getByText(appointment, "Error"));
    expect(getByText(appointment, "Error")).toBeInTheDocument();

    // confirm that on close it shows an empty appointment
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(getByAltText(appointment, "Add"));

  });
  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    // mock the error
    axios.delete.mockRejectedValueOnce();

    // select the appointment with the interview booked to be deleted
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[1];
  
    // trigger deleting event
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));

    // confirm that error message was sent
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Error"));

    // confirm that on close it shows the interview booked
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(getByText(appointment, "Archie Cohen"));
  });

});
