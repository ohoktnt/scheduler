import React from "react";

import "components/InterviewerListItem.scss";

const classNames = require('classnames');


export default function InterviewerListItem(props) {

  const listClass = classNames('interviewers__item', {
    "interviewers__item--selected": props.selected
  })

  let name = '';
  if (props.selected) {
    name = props.name
  } 

  return (
    <li className={listClass} 
    onClick={()=> props.setInterviewer(props.name)}>
    <img
    className="interviewers__item-image"
    src={props.avatar}
    alt={props.name}
    />
    {name}
    </li>
  )

}