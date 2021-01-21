import {useState} from 'react';

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode)
  const [history, setHistory] = useState([initialMode])

  function transition(newMode, replace) {
    let newHistory = [...history]
    // if replace is true, removed the last item in history, then add newMode
    if(replace) {
      newHistory = newHistory.slice(0,-1)
    }

    newHistory = [...newHistory, newMode]

    setHistory(newHistory)
    setMode(newMode);
  }

  function back(){
    if (history.length > 1) {

      let newHistory = [...history]
      newHistory = newHistory.slice(0,-1)

      setHistory(newHistory)

      setMode(newHistory[newHistory.length -1])
    }

  }

  return { mode, transition, back }

}


// refractored to not use pop and push methods as per instructor breakout
// function transition(newMode, replace) {
//   // if replace is true, removed the last item in history, then add newMode
//   if(replace) {
//     history.pop()
//   }

//   history.push(newMode)
  
//   setHistory(history)
//   setMode(newMode);
// }

// function back(){
//   if (history.length > 1) {
//     history.pop()
//     setMode(history[history.length -1])
//   }
// }

// return { mode, transition, back }

// }