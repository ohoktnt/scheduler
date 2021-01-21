import React from 'react';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';

import useVisualMode from 'hooks/useVisualMode';

import "components/Appointment/styles.scss";

// mode constants
const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';

export default function Appointment(props) {
  // call useVisualMode like the setState hook 
  const {mode, transition, back} = useVisualMode( props.interview ? SHOW : EMPTY );
  

  return (
    <article className="appointment">
      <Header time={props.time}/>
      

      {mode === EMPTY && <Empty onAdd={()=> transition(CREATE)}/>}
      
      {mode === SHOW && (
        <Show 
        student={props.interview.student} 
        interviewer={props.interview.interviewer.name} />
      )}

      {mode === CREATE && (
        <Form interviewers={[]} onCancel={() => back()}/>
      )}




    </article>
  )

}