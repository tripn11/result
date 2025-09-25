import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../reducers/authReducer';
import axios from 'axios';
import { setStudentsInClass } from '../../reducers/studentsReducer';
import { setResults } from '../../reducers/resultReducer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';
import ErrorModal from '../modals/ErrorModal';

const StudentList = () => {
    const students = useSelector(state => state.students.studentsInClass);
    const totalStudents = useSelector(state => state.students.totalStudentsInClass);
    const accessCode = useSelector(state => state.auth.token);
    const { title, teachersName, className } = useSelector(state => state.results.classDetails);
    const dispatch = useDispatch();
    const pages = Math.ceil(totalStudents / 20);
    const host = process.env.REACT_APP_HOST;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    const pageFetcher = async pageNumber => {
        setLoading(true);
        try {
            const response = await axios.get(`${host}/classStudents?page=${pageNumber}`, {
                headers: {
                    'Authorization': `Bearer ${accessCode}`
                }
            });
            dispatch(setStudentsInClass(response.data.students));
            dispatch(setResults(response.data.results));
        } catch (error) {
            setError(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    if(error) return <ErrorModal status={!!error} closer={() => setError(null)} error={error || "An error occurred"} />
    return loading ? <Loading /> : (
        <div>
            <span>Welcome, {title} {teachersName}</span>
            <p>Class: {className}</p>

            <h3>Student List</h3>
            <ol>
                {students.map(student => (
                    <li 
                    key={student.id} 
                    onClick={() =>
                    navigate(`/teacher/${student.id}`)}>
                        {student.fullName}
                    </li>
                ))}
            </ol>
            <button onClick={() => dispatch(logout())}>Logout</button>
            <div>
                {pages > 1 && Array.from({ length: pages }, (_, i) => (
                    <span key={i} onClick={() => pageFetcher(i + 1)}>
                        {i + 1}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default StudentList;
