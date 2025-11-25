import {useEffect, useState} from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setTotalStudentsInSchool } from "../../../reducers/studentsReducer";
import WarningModal from "../../modals/WarningModal.js";
import ErrorModal from "../../modals/ErrorModal.js";
import SuccessModal from "../../modals/SuccessModal.js";
import { setStudentsInSection } from "../../../reducers/studentsReducer.js";
import Loading from "../../Loading.js";


const Students = () => {
    const host = process.env.REACT_APP_HOST
    const token = useSelector(state=>state.auth.token)
    const totalStudentsInSchool = useSelector(state=>state.students.totalStudentsInSchool)
    const [warning, setWarning] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch()
    const location = useLocation()
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        }
        getTotalNumberOfStudents()
    },[totalStudentsInSchool])

    const promoter = async () => {
        setLoading(true);
        try {
            await axios.post(host+'/students/promote', {}, {
                headers:{
                    Authorization:'Bearer '+ token
                }
            })

            const studentData = await axios.get(host+'/sectionStudents?section='+section, {
                headers: {
                    Authorization:'Bearer '+ token
                }
            })

            const sectionStudents = studentData.data.students
            dispatch(setStudentsInSection(sectionStudents))
            dispatch(setTotalStudentsInSchool(0));

            setLoading(false)
            setWarning(false);
            setSuccessMessage('All students have been promoted successfully')
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 2000);
        }catch (e) {
            setError(e.message);
        }
    } 

    const codeResetter = async () => {
        try {
            await axios.post(host+'/students/resetCodes', {}, {
                headers:{
                    Authorization:'Bearer '+ token
                }
            })

            const studentData = await axios.get(host+'/sectionStudents?section='+section, {
                headers: {
                    Authorization:'Bearer '+ token
                }
            })

            const sectionStudents = studentData.data.students
            dispatch(setStudentsInSection(sectionStudents))

            setLoading(false)
            setSuccessMessage("All codes have been reset successfully")
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 2000);
        } catch (e) {
            setError(e.message);
        }
    }

    if(loading) {
        return <Loading />
    }
    
    return (
        <div id="admin-students">
            <div>
                <NavLink to="/admin/students" end>Nursery</NavLink>
                <NavLink to="/admin/students/primary">Primary</NavLink>
                <NavLink to="/admin/students/jss">Junior Sec</NavLink>
                <NavLink to="/admin/students/ss">Senior Sec</NavLink>            
            </div>
            <div><span>Total students in school:</span><span>{totalStudentsInSchool}</span></div>
            <Outlet />
            <div className="all-students-action">
                {totalStudentsInSchool>0 && <button onClick={codeResetter}>Reset All Student Codes</button>}
                {totalStudentsInSchool>0 && <button onClick={()=>setWarning(true)}>Promote All Students</button>}
            </div>


            <WarningModal 
                status={warning} 
                closer={()=>setWarning(false)} 
                confirmer ={promoter}
                message="Are you sure you want to promote all students?"
            />

            <SuccessModal 
                status={success}
                message={successMessage}
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