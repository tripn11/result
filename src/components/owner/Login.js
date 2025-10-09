import { useState } from "react";
import { useDispatch } from "react-redux";
import Loading from "../Loading";
import axios from "axios";
import ErrorModal from '../modals/ErrorModal';
import { setAuthState } from "../../reducers/authReducer";

const OwnerLogin = () => {
    const [passCode, setPassCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const host = process.env.REACT_APP_HOST;

    const verificator = async() => {
        try {
            setLoading(true);
            const response = await axios.get(host + '/schools', {
                headers: {'Authorization': `Bearer ${passCode}`}
            })
            dispatch(setAuthState({type: 'owner', schools: response.data, token:passCode}));
        }catch (e) {
            setError(e.response ? e.response.data : e.message);
        }finally {
            setLoading(false);
        }
    }

    if (loading) return <Loading />;
    return (
        <div>
            <input 
                type="password"
                value={passCode}
                onChange={(e) => setPassCode(e.target.value)}
            />

            <button onClick={verificator}>Submit</button>
            <ErrorModal status={!!error} closer={()=>setError('')} error={error} />
        </div>
    )
}

export default OwnerLogin;