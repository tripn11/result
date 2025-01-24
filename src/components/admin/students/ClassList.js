import React, {useState} from "react";
import StudentModal from "./StudentModal.js";


export default props => {
    const [listOpen, setListOpen] = useState(false)

    const listShower = () => {
        if(listOpen) {
            setListOpen(false)
        }else {
            setListOpen(true)
        }
    }

    return (
        <div>
            <div>
                {props.eachClass} {props.students.length} 
                <button>Add Student</button>
                <button onClick={listShower}>v</button>
            </div>

            {listOpen && (<div>
                {props.students.length>0?props.students:'No Student in this class'}</div>
            )}

            <StudentModal action="add"/>
        </div> 
    )
}
