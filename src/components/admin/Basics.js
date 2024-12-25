import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import { logout } from '../../reducers/authReducer.js';
import { setBasics } from '../../reducers/schoolReducer.js';
import { setAuthState } from '../../reducers/authReducer.js';
import Loading from '../Loading.js';
import SuccessModal from '../SuccessModal.js';
import ErrorModal from '../ErrorModal.js';

export default () => {
    const schoolDetails = useSelector(state=>state.school)
    const token = useSelector(state=>state.auth.token)
    const isModified = useSelector(state=>state.auth.basicsIsModified)
    const dispatch = useDispatch()
    const host = process.env.REACT_APP_HOST
    const [loading,setLoading] = useState(false)
    const [successModal, setSuccessModal]= useState(false)
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState('')
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
        setSchoolData({ ...schoolData, [name]: value });
        dispatch(setAuthState({basicsIsModified:true})) 
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
        delete finalSchoolData.session
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
            setErrorModal(true)
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
            setLoading(false)
            dispatch(logout())
        }catch (e) {
            console.log(e)
        }
    }

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

                <label htmlFor='session'>Session</label>
                <input 
                    value={schoolData.currentSession}
                    onChange={inputHandler}
                    name='currentSession'
                    placeholder='20XX/20XX'
                />

                <label htmlFor='timesOpened'>Number of times Opened</label>
                <input 
                    value={schoolData.totalTimesSchoolOpened}
                    onChange={inputHandler}
                    type='number'
                    name='totalTimesSchoolOpened'
                />
                <SuccessModal status={successModal} />
                <ErrorModal status={errorModal} error={error} closer={()=>setErrorModal(false)}/>

                <button type='submit' disabled={!isModified} > Save </button>
            </form>
            <button type='button' onClick={logger}> Logout </button>

        </div>
    )
}


//need to ensure the user is warned to save when moving from one component to another