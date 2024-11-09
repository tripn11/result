import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios";
import { logout } from '../../reducers/authReducer.js';

export default () => {
    const schoolDetails = useSelector(state=>state.school)
    const token = useSelector(state=>state.auth.token)
    const dispatch = useDispatch()
    const host = process.env.REACT_APP_HOST
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

    const schoolDetailSaver = e => {
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
    }

    const logger = async()=>{
        try{
            await axios.post(host+'/schools/logout',null, {
                headers: {
                    Authorization:'Bearer '+ token
                }
            }) 
            dispatch(logout())
        }catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <form onSubmit={schoolDetailSaver}>
                <label htmlFor='phone-number'>Phone Number</label>
                <input 
                    value={schoolData.phoneNumber}
                    onChange={inputHandler}
                    placeholder='+234 00000000'
                />

                <label htmlFor='address'>Address</label>
                <input 
                    value={schoolData.address}
                    onChange={inputHandler}
                />

                <label htmlFor='motto'>Motto</label>
                <input 
                    value={schoolData.motto}
                    onChange={inputHandler}
                />

                <label htmlFor='motto'>Motto</label>
                <input 
                    value={schoolData.motto}
                    onChange={inputHandler}
                />

                <label htmlFor='term'>Current Term</label>
                <select value={schoolData.currentTerm} onChange={inputHandler}>
                    <option value='first'>First</option>
                    <option value='second'>Second</option>
                    <option value='third'>Third</option>
                </select>

                <label htmlFor='session'>Session</label>
                <input 
                    value={schoolData.currentSession}
                    onChange={inputHandler}
                />

                <label htmlFor='timesOpened'>Number of times Opened</label>
                <input 
                    value={schoolData.totalTimesSchoolOpened}
                    onChange={inputHandler}
                    type='number'
                />

                <button type='submit'> Save </button>
            </form>
            <button type='button' onClick={logger}> Logout </button>

        </div>
    )
}