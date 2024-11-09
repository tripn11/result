import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'; 


export default () => {
    const authenticated = useSelector(state=>state.auth.type!=='')
    return authenticated?<Navigate to='/admin' />:<Outlet />
}