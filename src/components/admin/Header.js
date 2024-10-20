import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default () => {
    const nameOfSchool = useSelector(state=>state.school.name)
    return (
        <div>
            <h2>{nameOfSchool}</h2>
            <NavLink to='/admin'>Basics</NavLink>
            <NavLink to='/admin/classes'>Classes</NavLink>
            <NavLink to='/admin/results'>Results</NavLink>
            <Outlet />
        </div>
    )
} 