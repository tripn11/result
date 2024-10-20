import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'; 


export default () => {
    const authType = useSelector(state=>state.auth.type)
    return authType!=='admin'?<Navigate to='/teacher' />:<Outlet />
}