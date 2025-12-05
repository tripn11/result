import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../reducers/authReducer';
import axios from 'axios';
import { setStudentsInClass } from '../../reducers/studentsReducer';
import { setResults } from '../../reducers/resultReducer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';
import ErrorModal from '../modals/ErrorModal';
import Header from "../teacher/Header";

const StudentList = () => {
    const students = useSelector(state => state.students.studentsInClass);
    const totalStudents = useSelector(state => state.students.totalStudentsInClass);
    const accessCode = useSelector(state => state.auth.token);
    const { teachersTitle, teachersName, className } = useSelector(state => state.results.results[0] || {});
    const { schoolName } = useSelector(state => state.school.name);
    const dispatch = useDispatch();
    const host = process.env.REACT_APP_HOST;

    const studentsPerPage = 10; 
    const pages = Math.ceil(totalStudents / studentsPerPage);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleRange, setVisibleRange] = useState([1, 3]);

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
            setCurrentPage(pageNumber);
        } catch (error) {
            setError(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const scrollPagesLeft = () => {
        setVisibleRange(([start, end]) => {
        if (start === 1) return [start, end];
        return [start - 1, end - 1];
        });
    };

    const scrollPagesRight = () => {
        setVisibleRange(([start, end]) => {
        if (end >= pages) return [start, end];
        return [start + 1, end + 1];
        });
    };

    if (error)
        return (
            <ErrorModal
                status={!!error}
                closer={() => setError(null)}
                error={error || "An error occurred"}
            />
        );

    if (loading) return <Loading />;

    const startIndex = (currentPage - 1) * studentsPerPage + 1;

    return (
        <div id='student-list'>
            <Header content={schoolName} />
            <span className='teacher-welcome'>
                Welcome, {teachersTitle} {teachersName}
            </span>
            <p>Class: <span>{className}</span></p>

            <h3>Student List</h3>

            <ol start={startIndex}>
                {students.map(student => (
                <li
                    key={student.id}
                    onClick={() => navigate(`/teacher/${student.id}`)}
                >
                    {student.fullName}
                </li>
                ))}
            </ol>

            {pages > 1 && (
                <div className='pages'>
                    {pages>3 && <span
                        className={`arrow left ${visibleRange[0] === 1 ? 'disabled' : ''}`}
                        onClick={scrollPagesLeft}
                    >
                        <ion-icon name="chevron-back-outline"></ion-icon>
                    </span>}

                    {Array.from({ length: pages }, (_, i) => i + 1)
                        .slice(visibleRange[0] - 1, visibleRange[1])
                        .map(pageNum => (
                        <span
                            key={pageNum}
                            className={`page-numbers ${pageNum === currentPage ? 'active' : ''}`}
                            onClick={() => pageFetcher(pageNum)}
                        >
                            {pageNum}
                        </span>
                    ))}

                    {pages>3 && 
                    <span
                        className={`arrow right ${visibleRange[1] >= pages ? 'disabled' : ''}`}
                        onClick={scrollPagesRight}
                    >
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </span>}
                </div>
            )}

            <button onClick={() => dispatch(logout())}>Logout</button>
        </div>
    );
};

export default StudentList;
