import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'; 


const OwnerRoute = () => {
    const isOwner = useSelector(state=>state.auth.type === 'owner')
    return isOwner ? <Outlet />: <Navigate to='/' />
}

export default OwnerRoute;