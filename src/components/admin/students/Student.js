import { useState } from "react";
import StudentModal from "./StudentModal";

const Student = props => {
    const [modalStatus, setModalStatus] = useState(false);

    const editor = () => {
        setModalStatus(prev=>{
            if(prev){
                return false;
            }else {
                return true;
            }
        }) 
    }

    return (
        <div>
            <span>{props.index + 1}</span>
            <span>{props.student.name.surName+' '+ props.student.name.firstName +
                " "+props.student.name.otherName}</span> 
            <button onClick={editor}>Edit</button>
            <StudentModal action='edit' state={modalStatus} modalCloser={editor} student={props.student} classes={props.classes}/>
        </div>
    )
}

export default Student;