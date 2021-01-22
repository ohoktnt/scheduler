import React from 'react';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';

import useVisualMode from 'hooks/useVisualMode';

import "components/Appointment/styles.scss";

// mode constants
const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';

export default function Appointment(props) {
  // call useVisualMode like the setState hook 
  const {mode, transition, back} = useVisualMode( props.interview ? SHOW : EMPTY );
  
  // save function
  function save(name, interviewer) {
    
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)

    transition(SHOW);
  }

  function cancel() {

    props.cancelInterview(props.id)
    transition(EMPTY);

  }

  return (
    <article className="appointment">
      <Header time={props.time}/>
      

      {mode === EMPTY && <Empty onAdd={()=> transition(CREATE)}/>}
      
      {mode === SHOW && (
        <Show 
        student={props.interview.student} 
        interviewer={props.interview.interviewer.name}
        onDelete={cancel}
        />
      )}

      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={() => back()} onSave={save}/>
      )}

      {mode === SAVING && <Status message={'Saving'}/>}


    </article>
  )

}