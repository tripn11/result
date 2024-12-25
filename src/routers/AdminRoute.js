import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'; 


export default () => {
    const isAdmin = useSelector(state=>state.auth.type==='admin')
    return isAdmin ? <Outlet />: <Navigate to='/login' />
}