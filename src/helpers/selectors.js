

export default function getAppointmentsForDay(state, day) {
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