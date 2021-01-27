// helper functions to restructure data 

export function getAppointmentsForDay(state, day) {
  // 1. finding the object in our state.days whos name matches day
  const daySelected = state.days.find(eachDay => eachDay.name === day);

  // 2. validation - day does not exist, return []
  if(!daySelected) {
    return [];
  }

  // 3. for each appt id in the array, use map to find the appt obj using the id as a key
  const appointments = daySelected.appointments.map(apptId => state.appointments[apptId]);
      
  return appointments;
}

export function getInterview(state, interview) {
  // 1. if theres is no interview booked
  if(interview === null) {
    return null;
  }

  // 2. convert the interviewers obj into an array
  const interviewersArr = Object.values(state.interviewers);

  // 3. use find method to find the interviewer object where id matches the interview info
  const interviewerInfo = interviewersArr.find(eachInteriviewer => eachInteriviewer.id === interview.interviewer);

  const bookedInterview = {
    'interviewer': {...interviewerInfo},
    'student': interview.student
  };

  return bookedInterview;
}

export function getInterviewersForDay(state, day) {
  // 1. finding the object in our state.days whos name matches day
  const daySelected = state.days.find(eachDay => eachDay.name === day);

  // 2. validation - day does not exist, return []
  if(!daySelected) {
    return [];
  }

  // 3. for each interviewer id in the array, use map to find the interviewer obj using the id as a key
  const interviewers = daySelected.interviewers.map(interviewerId => state.interviewers[interviewerId]);

  return interviewers;
}
