import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'; 


const AdminRoute = () => {
    const isAdmin = useSelector(state=>state.auth.type==='admin')
    return isAdmin ? <Outlet />: <Navigate to='/login' />
}

export default AdminRoute;