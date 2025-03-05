import React, {useState} from "react";
import StudentModal from "./StudentModal.js";
import ClassStudentsList from "./ClassStudentsList.js";


export default props => {
    const [listOpen, setListOpen] = useState(false)
    const [studentModal, setStudentModal] = useState(false)    
    
    const listShower = () => {
        if(listOpen) {
            setListOpen(false)
        }else {
            setListOpen(true)
        }
    }

    const studentAdder = desiredState => {
        setStudentModal(desiredState)
    }

    const modalCloser = () => {
        setStudentModal(false)
    }

    return (
        <div>
            <div>
                {props.eachClass} {props.students.length} 
                <button onClick={()=>studentAdder(true)}>Add Student</button>
                <button onClick={listShower}>v</button>
            </div>

            {listOpen && <ClassStudentsList students={props.students} />}
            <StudentModal action="add" state={studentModal} modalCloser={modalCloser} actualClass={props.eachClass}/>
        </div> 
    )
}

//delete an existing student and observe the various populations
//edit student and see the reflection in the database