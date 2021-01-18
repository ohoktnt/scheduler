import React from "react";

export default function DayListItem(props) {
  return (
    <li 
      // selected={props.selected} not in the answer code?
      // onClick={props.setDay} not how it was given
      onClick={()=> props.setDay(props.name)}
      >
        <h2 className="text--regular">{props.name}</h2> 
        <h3 className="text--light">{props.spots}</h3>
    </li>
  );
}