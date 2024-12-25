import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';


export default () => {
    const nameOfSchool = useSelector(state=>state.school.name)
    const {basicsIsModified,classesIsModified} = useSelector(state=>state.auth)
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (e, to) => {
        const pathArray = location.pathname.split("/")
        const section = pathArray[pathArray.length-1]
        let isModified;
        
        switch(section) {
            case "admin":
                isModified=basicsIsModified
                break
            case "classes":
                isModified=classesIsModified
        }

        if(isModified){
            e.preventDefault();
            const confirmLeave = window.confirm('If you leave now, you would lose your unsaved data.');
            if (confirmLeave) {
                navigate(to);
            }
        }else {
            navigate(to)
        } 
    } 

    return (
        <div>
            <h2>{nameOfSchool}</h2>
            <NavLink to='/admin' onClick={e=>{handleNavigation(e,'/admin')}}>Basics</NavLink>
            <NavLink to='/admin/classes' onClick={e=>{handleNavigation(e,'/admin/classes')}}>Classes</NavLink>
            <NavLink to='/admin/students' onClick={e=>{handleNavigation(e,'/admin/students')}}>Students</NavLink>
            <NavLink to='/admin/results' onClick={e=>{handleNavigation(e,'/admin/results')}}>Results</NavLink>
            <Outlet />
        </div>
    )
} 