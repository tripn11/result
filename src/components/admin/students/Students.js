import React, {useEffect} from "react";
import { NavLink, Outlet } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setTotalStudentsInSchool } from "../../../reducers/studentsReducer";

export default () => {
    const host = process.env.REACT_APP_HOST
    const token = useSelector(state=>state.auth.token)
    const totalStudentsInSchool = useSelector(state=>state.students.totalStudentsInSchool)
    const dispatch = useDispatch()
    
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
        </div>
    )
}