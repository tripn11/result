import {useEffect, useState} from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setTotalStudentsInSchool } from "../../../reducers/studentsReducer";
import WarningModal from "../modals/WarningModal";
import ErrorModal from "../modals/ErrorModal";
import SuccessModal from "../modals/SuccessModal";
import { setStudentsInSection } from "../../../reducers/studentsReducer.js";


const Students = () => {
    const host = process.env.REACT_APP_HOST
    const token = useSelector(state=>state.auth.token)
    const totalStudentsInSchool = useSelector(state=>state.students.totalStudentsInSchool)
    const [warning, setWarning] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch()
    const location = useLocation()
    
    useEffect(()=>{
        const getTotalNumberOfStudents = async ()=> {
            try {
                const total = await axios.get(host+'/students/totalNumber', {
                    headers:{
                        Authorization:'Bearer '+ token
                    }
                })
                dispatch(setTotalStudentsInSchool(total.data.number))
            } catch (e) {
                console.log(e)
            }
        }
        getTotalNumberOfStudents()
    },[totalStudentsInSchool])

    const promoter = async () => {
        let section = location.pathname.split("/").pop();
        switch(section) {
            case 'students':
                section = 'nursery';
                break;
            case 'primary':
                section = 'primary';
                break;
            case 'jss':
                section = 'juniourSecondary';
                break;
            case 'ss':
                section = 'seniorSecondary';
                break;
        }

        try {
            await axios.post(host+'/students/promote', {}, {
                    headers:{
                        Authorization:'Bearer '+ token
                    }
                }
            )

            const studentData = await axios.get(host+'/sectionStudents?section='+section, {
                headers: {
                    Authorization:'Bearer '+ token
                }
            })

            const sectionStudents = studentData.data.students
            dispatch(setStudentsInSection(sectionStudents))
            dispatch(setTotalStudentsInSchool(0));

            setWarning(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 2000);
        }catch (e) {
            setError(e.message);
        }
    } 

    return (
        <div>
            <div>
                <NavLink to="/admin/students">Nursery</NavLink>
                <NavLink to="/admin/students/primary">Primary</NavLink>
                <NavLink to="/admin/students/jss">Junior Sec</NavLink>
                <NavLink to="/admin/students/ss">Senior Sec</NavLink>            
            </div>
            <div>Total number of students:{totalStudentsInSchool}</div>
            <Outlet />
            <button onClick={()=>setWarning(true)}>Promote All Students</button>

            <WarningModal 
                status={warning} 
                closer={()=>setWarning(false)} 
                confirmer ={promoter}
                message="Are you sure you want to promote all students?"
            />

            <SuccessModal 
                status={success}
                message="Students promoted successfully!"
            />

            <ErrorModal 
                status={!(error==='')}
                closer={()=>setError('')}
                error={error}
            />
        </div>
    )
}

export default Students;