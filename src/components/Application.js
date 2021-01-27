import React from "react";

import DayList from "components/DayList";
import Appointment from "components/Appointment";

import useApplicationData from 'hooks/useApplicationData';
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from '../helpers/selectors';

import "components/Appointment";
import "components/Application.scss";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  } = useApplicationData();
  
  // interviewers array to be passed to the appointment component
  const interviewersArr = getInterviewersForDay(state, state.day);
  
  // to to populate the appointments based on the day selected
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  
  // create schedule for the day selected with the interviewer name
  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    
    return (
      <Appointment
      key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={interview} 
      interviewers={interviewersArr}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
      />
    );
  });
  
  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
        />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList 
        days={state.days}
        day={state.day}
        setDay={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time='5pm'/>
      </section>
    </main>
  );
}
