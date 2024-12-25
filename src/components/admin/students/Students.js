import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default () => {
    return (
        <div>
            <div>
                <NavLink to="/admin/students">Nursery</NavLink>
                <NavLink to="/admin/students/primary">Primary</NavLink>
                <NavLink to="/admin/students/jss">Junior Sec</NavLink>
                <NavLink to="/admin/students/ss">Senior Sec</NavLink>            
            </div>
            <Outlet />
        </div>
    )
}