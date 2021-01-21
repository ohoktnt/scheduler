import {React, useState} from 'react';

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode)
  const [history, setHistory] = useState([initialMode])

  function transition(newMode, replace) {

    // if replace is true, removed the last item in history, then add newMode
    if(replace) {
      history.pop()
    }

    history.push(newMode)
    
    setHistory(history)
    setMode(newMode);
  }

  function back(){
    if (history.length > 1) {
      history.pop()
      setMode(history[history.length -1])
    }
  }

  return { mode, transition, back }

}