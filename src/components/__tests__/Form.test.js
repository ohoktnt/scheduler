import React from "react";

import { render, cleanup, getByAltText } from "@testing-library/react";
import { fireEvent } from "@testing-library/react/dist";

import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(<Form interviewers={interviewers}/>);
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(<Form name={"Lydia Miller-Jones"} interviewers={interviewers}/>);
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name is not blank", () => {
    const onSave = jest.fn();
    const { getByText } = render(<Form interviewers={interviewers} onSave={onSave}/>);

    fireEvent.click(getByText('Save'));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
  
  it("can successfully save after trying to submit an empty student name", () => {
    const onSave = jest.fn();
    const { getByText, getByPlaceholderText, queryByText, getByAltText } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );
    
    fireEvent.click(getByText("Save"));
  
    // confirm that error message appears
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  
    // complete the form to include the student name and interviewer
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText('Sylvia Palmer'));
    fireEvent.click(getByText("Save"));
  
    // confirm that the error message disappears
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });

  it("calls onCancel and resets the input field", () => {
    const onCancel = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        name="Lydia Mill-Jones"
        onSave={jest.fn()}
        onCancel={onCancel}
      />
    );
    // check that form does not submit with empty studet name
    fireEvent.click(getByText("Save"));

    // fill in student name and cancel
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByText("Cancel"));
  
    // confirm thath error message disappears, and form resets properly
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
  
});