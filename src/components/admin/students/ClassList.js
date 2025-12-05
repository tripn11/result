import {useState} from "react";
import StudentModal from "./StudentModal.js";
import ClassStudentsList from "./ClassStudentsList.js";


const ClassList = props => {
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
        <div className="class-list">
            <div>
                <div>{props.eachClass}</div>
                <button className="add-student" onClick={()=>studentAdder(true)}>+ Add Student</button>
                <div>{props.students.length} students</div>
                <button className="toggle-list"onClick={listShower}>{listOpen ? <ion-icon name="chevron-up-outline"></ion-icon> : <ion-icon name="chevron-down-outline"></ion-icon>}</button>
            </div>

            {listOpen && <ClassStudentsList students={props.students} classes={props.classes}/>}
            <StudentModal action="add" state={studentModal} modalCloser={modalCloser} actualClass={props.eachClass}/>
        </div> 
    )
}

export default ClassList;