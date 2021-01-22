import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from "components/DayList";
import "components/Appointment";

import "components/Application.scss";
import Appointment from "components/Appointment";

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from '../helpers/selectors'



export default function Application(props) {
  
  // managing state by combining
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })
  
  // to book Interview
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    axios.put(`/api/appointments/${id}`, appointment).then(res => {
      
      console.log(res)
      
    })

    setState(prev => ({...prev, appointments: appointments}))
    
  }

  // to cancel Interview
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    axios.delete(`/api/appointments/${id}`, appointment).then(res => {
      
      console.log(res)
      
    })

    setState(prev => ({...prev, appointments: appointments}))

  }



  // interviewers array to be passed to the appointment component
  const interviewersArr = getInterviewersForDay(state, state.day)

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

  // function to update the state of day
  const setDay = day => setState({...state, day});
  // const setDays = days => setState(prev => ({...prev, days}));

  useEffect(() => {
    // axios.get('/api/days').then(res => setDays(res.data))
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      // console.log(all[2].data);
      setState(prev => ({...prev, days: all[0].data, appointments: {...all[1].data}, interviewers: all[2].data }))
    })

  }, [])


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
        {/* {dailyAppointments.map( appt => <Appointment key={appt.id} {...appt} />)} */}
        {schedule}
        <Appointment key="last" time='5pm'/>
      </section>
    </main>

    


  );
}


