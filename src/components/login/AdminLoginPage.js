import {useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setInitialSchool } from '../../reducers/schoolReducer';
import { setAuthState } from "../../reducers/authReducer";
import Loading from "../Loading";
import BackButton from "../BackButton";
import ErrorModal from "../modals/ErrorModal";

const AdminLoginPage = () => {
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
           dispatch(setInitialSchool(schoolDetails.data.school))
           dispatch(setAuthState({token:schoolDetails.data.token,type:'admin'}))
        }catch (error) {
            setError(error.response?.data || error.message)
        }finally{
            setLoading(false)
        }
    }


    return loading?<Loading />:(
        <div id="admin-login">
            <header>
                <BackButton label="Go Home" destination="/"/>
                <img src='/favicon/apple-touch-icon.png' alt="logo" />
            </header>
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
                <div className="password-input">
                   <input 
                        value={loginDetails.password}
                        onChange={inputHandler}
                        type={showPassword?'text':'password'}
                        name="password"
                        required
                    />
                    <ion-icon 
                        name={showPassword?"eye-off-outline":"eye-outline"} 
                        onMouseDown={()=>setShowPassword(true)} 
                        onMouseUp={()=>setShowPassword(false)}>
                    </ion-icon> 
                </div>
                <button type="submit">Login</button>
                <ErrorModal status={!!error} closer={()=>setError("")} error={error}/>
            </form>
            <p>New to result? <Link to='/signup'>Sign up</Link></p>
        </div>
    )
}

export default AdminLoginPage;
