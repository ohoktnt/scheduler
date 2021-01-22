import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
// transferred over from application js

// managing state by combining
const [state, setState] = useState({
  day: 'Monday',
  days: [],
  appointments: {},
  interviewers: {}
})

// function to update the state of day
const setDay = day => setState({...state, day});

// to update the spots based if interview exists or not
function updateSpots(interview){
  // find the dayObj based on day selected
  const dayObj = state.days.find(eachDay => eachDay.name === state.day)
  // update spots according to appointment.interview
  interview ? dayObj.spots -= 1 : dayObj.spots += 1
  // create a new days obj to be updated with setState
  const days = [...state.days]
  days[dayObj.id - 1] = dayObj
  return days
}
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

    const days = updateSpots(appointment.interview)

    return axios.put(`/api/appointments/${id}`, appointment).then(res => {
      setState(prev => ({...prev, appointments: appointments, days: days}))
    })
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

    const days = updateSpots(appointment.interview);

    return axios.delete(`/api/appointments/${id}`, appointment).then(res => {
      setState(prev => ({...prev, appointments: appointments, days: days}))
    })
  }


  // to collect data from api
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: {...all[1].data}, interviewers: all[2].data }))
    })
  }, [])

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  }

}