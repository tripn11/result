import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'; 


const PublicRoute = () => {
    const authenticated = useSelector(state=>state.auth.type!=='')
    return authenticated?<Navigate to='/admin' />:<Outlet />
}

export default PublicRoute;