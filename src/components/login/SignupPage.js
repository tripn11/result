import {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Loading from '../Loading';
import ErrorModal from '../modals/ErrorModal';
import SuccessModal from '../modals/SuccessModal';
import BackButton from "../BackButton";

const SignupPage = ()=> {
    const [school,setSchool] = useState({name:'',email:'',password:''})
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState({})
    const [success, setSuccess] = useState(false);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const host = process.env.REACT_APP_HOST
    
    const inputHandler = e => {
        const { name, value } = e.target;
        setSchool({ ...school, [name]: value });
        setError({})
    };

    const formHandler = async e => {
        e.preventDefault()

        try {
            setLoading(true)
            await axios.post(host+'/schools', school);
            setLoading(false)
            setSuccess(true)
            setTimeout(()=>{setSuccess(false)}, 5000);
            setTimeout(()=>navigate("/login"),5000);
        } catch (e) {
            setLoading(false)
            setError(e.response?.data?.error || {message:e.response?.data || e.message})
        }
    }


    if(loading) {
        return <Loading />
    }else {
        return (
            <div id='signup'>
                <header>
                    <BackButton label="Go Home" destination="/"/>
                    <img src='/favicon/apple-touch-icon.png' alt="logo" />
                </header>
                <form onSubmit={formHandler}>
                    <h2>Sign Up</h2>
                    <label htmlFor='name'>Full Name of School</label>
                    <input 
                        value={school.name}
                        onChange={inputHandler}
                        name='name'
                        required
                    />
                    {error.duplicate && <p className='error-message'>{error.duplicate}</p>}
                    <label htmlFor='email'>Email</label>
                    <input 
                        value={school.email}
                        onChange={inputHandler}
                        name='email'
                        type='email'
                        required
                    />
                    {error.email && <p className='error-message'>{error.email}</p>}

                    <label htmlFor='phoneNumber'>Phone Number</label>
                    <input 
                        value={school.phoneNumber}
                        onChange={inputHandler}
                        name='phoneNumber'
                        type='tel'
                        required
                    />
                    {(error.phoneNumber && !error.email) && <p className='error-message'>{error.phoneNumber}</p>}

                    <label htmlFor='password'>Password</label>
                    <div className='password-input'>
                        <input 
                            value={school.password}
                            onChange={inputHandler}
                            name='password'
                            type={showPassword?'text':'password'}
                            required
                        />
                        <ion-icon 
                            onClick={()=>setShowPassword(prev=>!prev)} 
                            name={showPassword?"eye-off-outline":"eye-outline"}>
                        </ion-icon>
                    </div>
                         
                    {(error.password && !error.email && !error.phoneNumber) && <p className='error-message'>
                        {error.password}
                    </p>}

                    <button type='submit'>Sign up</button>
                </form>
                <p>Already have an account? <Link to='/login'>Login</Link></p>
                <ErrorModal status={!!error.message} closer={()=>setError({message:""})} message={error.message} />
                <SuccessModal status={success} 
                    message={`
                        Your account has been created successfully. 
                        <br />Please subscribe to activate your account. 
                        <br />Redirecting to login page...`
                    } 
                />
            </div>
        )
    }
}

export default SignupPage;