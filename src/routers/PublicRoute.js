import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'; 


const PublicRoute = () => {
    const identity = useSelector(state=>state.auth.type)
    const unknown = identity !== 'admin' && identity !== 'teacher' && identity !== 'student';
    return unknown?<Outlet />:<Navigate to={`/${identity}`} />
}

export default PublicRoute;