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

    return axios.put(`/api/appointments/${id}`, appointment).then(res => {
      setState(prev => ({...prev, appointments: appointments}))
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

    return axios.delete(`/api/appointments/${id}`, appointment).then(res => {
      setState(prev => ({...prev, appointments: appointments}))
    })

  }

  // to edit Interview
  function editInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.put(`/api/appointments/${id}`, appointment).then(res => {
      setState(prev => ({...prev, appointments: appointments}))
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
    editInterview
  }

}