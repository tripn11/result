import React from "react";
import Student from "./Student";

export default props => {
    return props.students.length<1?'No Students in this class':(
        <div>
            {props.students.map((each,index) => <Student key = {each._id} index={index} student={each} />)}
        </div>
    )
}