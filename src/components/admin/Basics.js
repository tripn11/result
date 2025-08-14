import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import { logout } from '../../reducers/authReducer.js';
import { setBasics } from '../../reducers/schoolReducer.js';
import { setAuthState } from '../../reducers/authReducer.js';
import Loading from '../Loading.js';
import SuccessModal from './modals/SuccessModal.js';
import ErrorModal from './modals/ErrorModal.js';
import WarningModal from './modals/WarningModal.js';

const Basics = () => {
    const schoolDetails = useSelector(state=>state.school)
    const token = useSelector(state=>state.auth.token)
    const isModified = useSelector(state=>state.auth.basicsIsModified)
    const dispatch = useDispatch()
    const host = process.env.REACT_APP_HOST
    const [loading,setLoading] = useState(false)
    const [successModal, setSuccessModal]= useState(false)
    const [error, setError] = useState('')
    const [sessionWarning, setSessionWarning] = useState(false);
    const [pendingSession, setPendingSession] = useState('');
    const currentYear = new Date().getFullYear()
    const [schoolData, setSchoolData] = useState({
        phoneNumber:schoolDetails.phoneNumber,
        address:schoolDetails.address,
        motto:schoolDetails.motto,
        currentTerm:schoolDetails.termInfo.currentTerm,
        currentSession:schoolDetails.termInfo.currentSession,
        totalTimesSchoolOpened:schoolDetails.termInfo.totalTimesSchoolOpened
    })

    useEffect(()=>{
        const beforeExit = e => {
            if(isModified) {
                e.preventDefault()
                e.returnValue=""
            }
        }
        window.addEventListener("beforeunload",beforeExit)
        return () => {
            window.removeEventListener("beforeunload",beforeExit)
        }
    }, [isModified])

    const inputHandler = e => {
        const { name, value } = e.target;
        if (name === 'currentSession' && value !== schoolData.currentSession) {
            setPendingSession(value);
            setSessionWarning(true);
        } else {
            setSchoolData({ ...schoolData, [name]: value });
            dispatch(setAuthState({ basicsIsModified: true }));
        }
    };

    const schoolDetailSaver = async e => {
        e.preventDefault()

        const finalSchoolData = {
            ...schoolData,
            termInfo:{
                currentTerm:schoolData.currentTerm,
                currentSession:schoolData.currentSession,
                totalTimesSchoolOpened:schoolData.totalTimesSchoolOpened
            }
        }
        delete finalSchoolData.currentTerm
        delete finalSchoolData.currentSession
        delete finalSchoolData.totalTimesSchoolOpened  
        
        try {
            setLoading(true)
            dispatch(setBasics(finalSchoolData))
            await axios.patch(host+'/schools',finalSchoolData, {
                headers: {
                    Authorization:'Bearer '+ token
                }
            })
            setLoading(false)
            setSuccessModal(true)
            setTimeout(()=>setSuccessModal(false),1500)
            dispatch(setAuthState({basicsIsModified:false}))
        } catch (e) {
            setLoading(false)
            if(e.response && e.response.data) {
                setError(e.response.data)
            }else {
                setError(e.message)
            }
        }
    }

    const logger = async()=>{
        try{
            setLoading(true)
            await axios.post(host+'/schools/logout',null, {
                headers: {
                    Authorization:'Bearer '+ token
                }
            }) 
            dispatch(logout())
        }catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const confirmSessionChange = () => {
        setSchoolData({ ...schoolData, currentSession: pendingSession });
        dispatch(setAuthState({ basicsIsModified: true }));
        setSessionWarning(false);
        setPendingSession('');
    };

    const cancelSessionChange = () => {
        setPendingSession('');
        setSessionWarning(false);
    };


    return loading?<Loading />:(
        <div>
            <form onSubmit={schoolDetailSaver}>
                <label htmlFor='phone-number'>Phone Number</label>
                <input 
                    value={schoolData.phoneNumber}
                    onChange={inputHandler}
                    name='phoneNumber'
                />

                <label htmlFor='address'>Address</label>
                <input 
                    value={schoolData.address}
                    onChange={inputHandler}
                    name='address'
                />

                <label htmlFor='motto'>Motto</label>
                <input 
                    value={schoolData.motto}
                    onChange={inputHandler}
                    name='motto'
                />

                <label htmlFor='term'>Current Term</label>
                <select value={schoolData.currentTerm} onChange={inputHandler} name='currentTerm'>
                    <option value='first'>First</option>
                    <option value='second'>Second</option>
                    <option value='third'>Third</option>
                </select>

                <label htmlFor='currentSession'>Current Academic Session</label>
                <select
                    value={schoolData.currentSession}
                    onChange={inputHandler}
                    name='currentSession'
                >
                    <option value={`${currentYear-1}/${currentYear}`}>{currentYear-1}/{currentYear}</option>
                    <option value={`${currentYear}/${currentYear+1}`}>{currentYear}/{currentYear+1}</option>
                </select>

                <label htmlFor='timesOpened'>Number of times Opened</label>
                <input 
                    value={schoolData.totalTimesSchoolOpened}
                    onChange={inputHandler}
                    type='number'
                    name='totalTimesSchoolOpened'
                />
                <SuccessModal 
                    status={successModal} 
                    message={"School details have been successfully saved"}
                />
                <ErrorModal 
                    status={!(error==='')} 
                    error={error} 
                    closer={()=>setError('')}
                />

                <WarningModal
                    status={sessionWarning}
                    closer={cancelSessionChange}
                    confirmer={confirmSessionChange}
                    message={
                        <>
                            <h3>Important!</h3>
                            <p>
                                Changing the academic session is a critical action that affects the entire school database.<br /><br />
                                <b>Only do this at the start of a new academic year.</b><br /><br />
                                Once changed, all new records will belong to the new session.<br />
                                Past results will remain in their original session.<br /><br />
                                <b>Proceed only if you are certain.</b><br /><br />
                                Change session from <b>{schoolData.currentSession} → {pendingSession}</b>?
                            </p>
                        </>
                    }
                />

                <button type='submit' disabled={!isModified} > Save </button>
            </form>
            <button type='button' onClick={logger}> Logout </button>
        </div>
    )
}

export default Basics;