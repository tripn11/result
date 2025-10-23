import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import axios from 'axios';
import Loading from '../Loading';
import ErrorModal from '../modals/ErrorModal';
import SuccessModal from '../modals/SuccessModal';
import { setAuthState } from "../../reducers/authReducer";


const Dashboard = () => {
    const {schools, token} = useSelector(state=>state.auth);
    const host = process.env.REACT_APP_HOST;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [mySchools, setMySchools] = useState({});
    const [updatedSchools, setUpdatedSchools] = useState({});
    const [checkAll, setCheckAll] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const temp = {};
        schools.forEach(school => {
            temp[school.name] = school;
        })
        setMySchools(temp);
    },[schools])

    const handler = e => {
        if(e.target.name==='checkAll') {
            setCheckAll(prev=>!prev)

            const mySchoolsArray = Object.values(mySchools);
            const newMySchools = {};
            
            mySchoolsArray.forEach(school => {
                newMySchools[school.name] = {...school,approved:e.target.checked}
            })

            setMySchools(newMySchools);
            setUpdatedSchools(newMySchools);
        } else {
            setMySchools(prev => ({
                ...prev,
                [e.target.name]: {
                    ...mySchools[e.target.name],
                    approved:e.target.checked
                }
            }))

            setUpdatedSchools(prev=>({
                ...prev,
                [e.target.name]:{
                    ...mySchools[e.target.name],
                    approved:e.target.checked
                }
            }))
        }
    }

    const saver = async () => {
        try {
            console.log(updatedSchools)
            setLoading(true);
            await axios.patch(host+'/overallSchools',updatedSchools, {
                headers: {'Authorization': `Bearer ${token}`}
            })
            setSuccess(true);
            setTimeout(()=>setSuccess(false),2000);
        }catch (e) {
            setError(e.response ? e.response.data : e.message);
        } finally {
            setLoading(false);
        }
    }

    const logger = () => {
        dispatch(setAuthState({type:'',token:'',schools:[]}))
    }

    if (loading) return <Loading />;
    return (
        <div id="owner">
            <h1>Welcome Master Noble</h1>
            <h2>List of Schools</h2>
            <div className="check-all">
                <label>Check All:</label>
                <input 
                    type='checkbox' 
                    checked= {checkAll} 
                    onChange={handler}
                    name={"checkAll"}
                />
            </div>
            <ol>
                <li>
                    <span>S/N</span>
                    <span>Schools</span>
                    <span>Approved</span>
                    <span>Population</span>
                </li>
                {schools
                    .toSorted((a,b)=>(a.name.localeCompare(b.name)))
                    .map((school, index)=> (
                        <li key={school._id}>
                            <span>{index+1}</span>
                            <span>{school.name}</span>
                            <input 
                                type='checkbox' 
                                checked= {mySchools[school.name]?.approved || false} 
                                onChange={handler}
                                name={school.name}
                            />
                            <span>{school.population}</span>
                        </li>
                    )
                )}
            </ol>
            <div className="buttons">
                <button onClick={saver}>Save</button>
                <button onClick={logger}>Logout</button>
            </div>

            <ErrorModal status={!!error} closer={()=>setError('')} error={error} />
            <SuccessModal status={success} message="Updated Successfully" />
        </div>
    )
}

export default Dashboard;