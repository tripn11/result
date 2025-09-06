import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'; 


const TeachersRoute = () => {
    const isTeacher = useSelector(state=>state.auth.type === 'teacher')
    return isTeacher ? <Outlet />: <Navigate to='/' />
}

export default TeachersRoute;