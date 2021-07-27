import { useEffect, useReducer } from 'react';
import axios from 'axios';
// const WebSocket = require('ws')
import { getInterview } from "helpers/selectors"

export default function useApplicationData() {
  // replace setState with reducer
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.value}
      case SET_APPLICATION_DATA:
        return {...state,
          days: action.value.days,
          appointments: action.value.appointments,
          interviewers: action.value.interviewers
        }
      case SET_INTERVIEW: 
        return {...state,appointments: action.value.appointments, days: action.value.days}
      default:
        throw new Error (
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  // function to update the state of day
  const setDay = day => dispatch({type: SET_DAY, value: day});

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

    // function used when edit the spots, spots should not change
    let days = []
    if (!state.appointments[id].interview) {
      days = updateSpots(appointment.interview)
    } else {
      days = [...state.days]
    }

    return axios.put(`/api/appointments/${id}`, appointment).then(res => {
      dispatch({type: SET_INTERVIEW, value: {appointments: appointments, days: days}})
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
      // setState(prev => ({...prev, appointments: appointments, days: days}))
      dispatch({type: SET_INTERVIEW, value: {appointments: appointments, days: days}})

    })
  }

  // to collect data from api
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      dispatch({type: SET_APPLICATION_DATA, value: {days: all[0].data, appointments: {...all[1].data}, interviewers: all[2].data }})
    })
  }, [])

  // establish websocket connection
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8001")

    socket.addEventListener('open', function(event) {
      socket.send('ping')
    })

    socket.addEventListener('message', function(event) {
      console.log("Message Recieved: ", event.data)
      const message = JSON.parse(event.data)
      console.log("originally message")
      console.log(message)
      if (message.interview) {
        console.log("has state been set yet?")
        console.log(state)
        const newInterview = getInterview(state, message.interview)
        console.log('new interview added!')
        console.log(newInterview)
      } 
      if (message.interview === null) {
        console.log('interview cancelled!')
      }
    })

  },[state.interviewers])

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  }

}