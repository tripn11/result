import {useState} from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import BackButton from "../BackButton";
import axios from 'axios';
import Loading from '../Loading';
import ErrorModal from '../modals/ErrorModal';
import { setAuthState } from '../../reducers/authReducer';
import { setResults, setClassDetails } from '../../reducers/resultReducer';
import { setStudentsInClass, setTotalStudentsInClass, setStudent } from "../../reducers/studentsReducer";

const LoginPage = () => {
    const host = process.env.REACT_APP_HOST
    const [accessCode, setAccessCode] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { role } = useParams();
    const dispatch = useDispatch();

    const grantAccess = async () => {
        setLoading(true);
        try{
            if(role==='teacher') {
                const response = await axios.get(host+"/classStudents", {
                    headers: {
                        'Authorization': `Bearer ${accessCode}`
                    }
                })
                dispatch(setStudentsInClass(response.data.students));
                dispatch(setResults(response.data.results));
                dispatch(setClassDetails({
                    teachersTitle: response.data.teachersTitle,
                    teachersName: response.data.teachersName,
                    className: response.data.teachersClass,
                    timesSchoolOpened:response.data.timesSchoolOpened,
                    schoolName: response.data.schoolName,
                }));
                dispatch(setTotalStudentsInClass(response.data.totalStudentsInClass));
            } else if(role==='student') {
                const response = await axios.get(host+"/student", {
                    headers: {
                        'Authorization': `Bearer ${accessCode}`
                    }
                })
                dispatch(setStudent(response.data));
            }

            dispatch(setAuthState({type:role,token:accessCode}))
            
        } catch(e) {
            setError(e.response ? e.response.data : e.message);
        } finally {
            setLoading(false);
        }
    }

    return loading ? <Loading /> : (
        <div id="login">
            <BackButton />
            <h2>Welcome, {role==='teacher'?'Sculptor of Young Minds':'Future Leader'}</h2>
            <img src="/graduation-cap.png" alt="a graduation cap" />
            <p>Input your access code below</p>
            <input 
                value={accessCode}
                onChange={e=>setAccessCode(e.target.value)}
            />
            <button onClick={grantAccess} className="normal">Enter</button>


            <ErrorModal status={!!error} closer={()=>setError('')} error={error} />
        </div>
    )
}

export default LoginPage;
