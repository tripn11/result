import React,{useState} from "react";
import Modal from 'react-modal';

export default props => {
    const [student, setStudent]= useState({
        surName:'',
        firstName:'',
        otherName:'',
        sex:'',
        dateOfBirth:'',
        height:'',
        weight:'',
        status:''
    })

    return (
        <Modal>
            <h2>{props.action} student</h2>

            <div>
                <label htmlFor="surName">SurName</label>
                <input id="surName" name="surName" value={student.surName} onChange={changeHandler}/>
            </div>

            <div>
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" value={student.firstName} onChange={changeHandler}/>
            </div>

            <div>
                <label htmlFor="otherName">Other Name</label>
                <input id="otherName" name="otherName" value={student.otherName} onChange={changeHandler}/>
            </div>
            
            <div>
                <label htmlFor="sex">Sex</label>
                <select id="sex" name="sex" value={student.sex} onChange={changeHandler}>
                    <option>Male</option>
                    <option>Female</option>
                </select>
            </div>

            <div>
                <label htmlFor="dateOfBirth">First Name</label>
                <input 
                    id="dateOfBirth" name="dateOfBirth" type="date"
                    value={student.dateOfBirth} onChange={changeHandler}/>
            </div>

            <div>
                <label htmlFor="height">Height</label>
                <input id="height" name="height" value={student.height} />
                <span>cm</span>
            </div>

            <div>
                <label htmlFor="weight">Weight</label>
                <input id="weight" name="weight" value={student.weight} />
                <span>kg</span>
            </div>

            <div>
                <label htmlFor="status">Status</label>
                <input id="status" name="status" value={student.status} type="checkbox"><span></span></input>
            </div>

            {props.action==='edit' && <button>Delete student</button>} 

            <button>Save</button>

        </Modal>
    )
}
//number input,