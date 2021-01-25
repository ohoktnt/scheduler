import React from 'react';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';
import Error from 'components/Appointment/Error';

import useVisualMode from 'hooks/useVisualMode';

import "components/Appointment/styles.scss";

// mode constants
const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';
const EDIT = 'EDIT';
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';

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

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((err)=> transition(ERROR_SAVE, true))

  }

  function destroy(event) {

    transition(DELETING, true);

    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((err) => transition(ERROR_DELETE, true))

  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time}/>
      

      {mode === EMPTY && <Empty onAdd={()=> transition(CREATE)}/>}
      
      {mode === SHOW && (
        <Show 
        student={props.interview.student} 
        interviewer={props.interview.interviewer.name}
        onDelete={()=> transition(CONFIRM)}
        onEdit={()=> transition(EDIT)}
        />
      )}

      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={() => back()} onSave={save}/>
      )}

      {mode === SAVING && <Status message={'Saving'}/>}
      
      {mode === DELETING && <Status message={'Deleting'} />}

      {mode === CONFIRM && <Confirm message={'Are you sure you would like to delete?'} onCancel={() => back()} onConfirm={destroy}/>}

      {mode === EDIT && <Form interviewers={props.interviewers} onCancel={()=> back()} onSave={save}  
        name={props.interview.student} interviewer={props.interview.interviewer.id} />}

      {mode === ERROR_SAVE && <Error message={'Error - could not save '} onClose={() => back()}/> }

      {mode === ERROR_DELETE && <Error message={'Error - could not delete '} onClose={() => back()}/> }


    </article>
  )

}