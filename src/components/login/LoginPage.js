import {useState} from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import BackButton from "../BackButton";
import axios from 'axios';
import Loading from '../Loading';
import ErrorModal from '../modals/ErrorModal';
import { setAuthState } from '../../reducers/authReducer';
import { setResults, setClassDetails } from '../../reducers/resultReducer';
import { setStudentsInClass, setTotalStudentsInClass } from "../../reducers/studentsReducer";

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
            const response = await axios.get(host+"/classStudents", {
                headers: {
                    'Authorization': `Bearer ${accessCode}`
                }
            })

            if(role==='teacher') {
                dispatch(setStudentsInClass(response.data.students));
                dispatch(setResults(response.data.results));
                dispatch(setClassDetails({
                    title: response.data.teachersTitle,
                    teachersName: response.data.teachersName,
                    className: response.data.teachersClass
                }));
                dispatch(setTotalStudentsInClass(response.data.totalStudentsInClass));
            }
            dispatch(setAuthState({type:role,token:accessCode}))
        } catch(e) {
            setError(e.response ? e.response.data : e.message);
        } finally {
            setLoading(false);
        }
    }

    return loading ? <Loading /> : (
        <div>
            <BackButton label="Go Home" destination="/"/>
            <h1>Welcome, {role==='teacher'?'Sculptor of Young Minds':'Future Leader'}</h1>
            <input 
                value={accessCode}
                onChange={e=>setAccessCode(e.target.value)}
            />
            <button onClick={grantAccess}>Enter</button>

            <ErrorModal status={!!error} closer={()=>setError('')} error={error} />
        </div>
    )
}

export default LoginPage;
