import React from 'react';
import { render } from "@testing-library/react";
import Appointment from "components/Appointment";


describe("Appointment", ()=> {

  // to be removed when there are other tests in the file
  // as per compass: remove test "renders without crashing"
  it("renders without crashing", () => {
    render(<Appointment />);
  })


})