import React, {useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setBasics } from '../../reducers/schoolReducer';
import { setAuthState } from "../../reducers/authReducer";
import { Circles } from "react-loader-spinner";


export default () => {
    const [loginDetails, setLoginDetails] = useState({email:'',password:''})
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch();
    const host = process.env.REACT_APP_HOST

    const inputHandler = e => {
        const { name, value } = e.target;
        setLoginDetails({ ...loginDetails, [name]: value });
        setError('')
    };

    const formHandler = async e => {
        e.preventDefault()
        try{
           setLoading(true)
           const schoolDetails =  await axios.post(host+'/schools/login',loginDetails)
           dispatch(setBasics(schoolDetails.data.school))
           dispatch(setAuthState({token:schoolDetails.data.token,type:'admin'}))
           setLoading(false)
        }catch (error) {
            setLoading(false)
            if(error.response) {
                setError(error.response.data)
            }else {
                setError(error.message)
            }
        }
    }


    if(loading) {
        return <Circles />
    }

    return (
        <div>
            <form onSubmit={formHandler}>
                <h2>Login as Admin</h2>
                <label htmlFor="email">Email</label>
                <input 
                    value={loginDetails.email}
                    onChange={inputHandler}
                    type="email"
                    name="email"
                    required
                />
                <label htmlFor="password">Password</label>
                <input 
                    value={loginDetails.password}
                    onChange={inputHandler}
                    type={showPassword?'text':'password'}
                    name="password"
                    required
                />
                <button 
                    type="button" 
                    onMouseDown={()=>setShowPassword(true)}
                    onMouseUp={()=>setShowPassword(false)}
                    >{showPassword?'--':'oo'}</button>
                {error&&<p>{error}</p>}
                <button type="submit">Login</button>
            </form>
            <p>New to result? <Link to='/signup'>Sign up</Link></p>
        </div>
        
    )
}