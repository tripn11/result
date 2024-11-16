import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios";
import { logout } from '../../reducers/authReducer.js';
import { setBasics } from '../../reducers/schoolReducer.js';
import { Circles } from "react-loader-spinner";
import Modal from 'react-modal';

export default () => {
    const schoolDetails = useSelector(state=>state.school)
    const token = useSelector(state=>state.auth.token)
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


    const inputHandler = e => {
        const { name, value } = e.target;
        setSchoolData({ ...schoolData, [name]: value });
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
            await axios.patch(host+'/schools',finalSchoolData, {
                headers: {
                    Authorization:'Bearer '+ token
                }
            })
            dispatch(setBasics(finalSchoolData))
            setLoading(false)
            setSuccessModal(true)
            setTimeout(()=>setSuccessModal(false),1500)
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


    return loading?<Circles />:(
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

                <Modal isOpen={successModal}>
                    <p>v</p>
                    <p>saved</p>
                </Modal>

                <Modal
                    isOpen={errorModal}
                    onRequestClose={()=>setErrorModal(false)}
                >
                    <p>{error}</p>
                </Modal>

                <button type='submit'> Save </button>
            </form>
            <button type='button' onClick={logger}> Logout </button>

        </div>
    )
}
