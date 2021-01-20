// helper functions to restructure data 

export function getAppointmentsForDay(state, day) {
  // returns an array of appointsments for the day
  let results = [];

  // 1. finding the object in our state.days whos name matches day
  for (let dayOfArr of state.days) {
    if (dayOfArr.name === day ) {
      const appointmentArray = [...dayOfArr.appointments];
      // 2. access to appt array for the given day, we need to iterate through 
      for(let appointment of appointmentArray) {
        // and compare where its id matches the id of states.appointments and return that
        if(state.appointments[appointment]) {
          results.push(state.appointments[appointment])
        }
      }
    }
  }
  // 3. validation - if no appointments on the given day, return empty []
  return results;
}

export function getInterview(state, interview) {

  // if theres is no interview booked
  if(interview === null) {
    return null;
  }

  // using the interviewers id find match in the interviewers list
  for (let interviewer in state.interviewers) {
    if (interview.interviewer === state.interviewers[interviewer].id) {
      const interviewerInfo = state.interviewers[interviewer]
      //construct the result object
      const result = {
        'interviewer': {...interviewerInfo},
        'student': interview.student
      }
      // if there is match, no need to complete loop
      return result;
    }
  }
}