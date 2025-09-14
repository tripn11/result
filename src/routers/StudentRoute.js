import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'; 


const StudentsRoute = () => {
    const isStudent = useSelector(state=>state.auth.type === 'student')
    return isStudent ? <Outlet />: <Navigate to='/' />
}

export default StudentsRoute;