import React from 'react';
import useVisualMode from 'hooks/useVisualMode';

// Appointment children componenets
import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';
import Error from 'components/Appointment/Error';

import "components/Appointment/styles.scss";

// transition mode constants
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
  const {mode, transition, back} = useVisualMode( props.interview ? SHOW : EMPTY );
  
  function save(name, interviewer) {
    // create a new interview obj to be passed up
    const interview = {
      student: name,
      interviewer
    };
    
    // async transition indicator
    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((err)=> transition(ERROR_SAVE, true));
  }

  function destroy() {
    // async transition indicator
    transition(DELETING, true);

    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((err) => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time}/>

      {/* Show empty appointment slot */}
      {mode === EMPTY && <Empty onAdd={()=> transition(CREATE)}/>}
      
      {/* Show booked interview in appointment slot */}
      {mode === SHOW && (
        <Show 
        student={props.interview.student} 
        interviewer={props.interview.interviewer.name}
        onDelete={()=> transition(CONFIRM)}
        onEdit={()=> transition(EDIT)}
        />
      )}

      {/* Show form to create/edit an interivew  */}
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => back()} onSave={save}/>}

      {mode === EDIT && <Form interviewers={props.interviewers} onCancel={()=> back()} onSave={save}  
        name={props.interview.student} interviewer={props.interview.interviewer.id} />
      }

      {/* Show async transition showing  */}
      {mode === SAVING && <Status message={'Saving'}/>}
      
      {mode === DELETING && <Status message={'Deleting'} />}
      {mode === CONFIRM && <Confirm message={'Are you sure you would like to delete?'} onCancel={() => back()} onConfirm={destroy}/>}

      {/* Show axios request errors */}
      {mode === ERROR_SAVE && <Error message={'Error - could not save '} onClose={() => back()}/> }
      {mode === ERROR_DELETE && <Error message={'Error - could not delete '} onClose={() => back()}/> }

    </article>
  );
}