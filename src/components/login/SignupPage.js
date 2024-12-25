import React,{useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { Circles } from "react-loader-spinner";
import { setInitialSchool } from '../../reducers/schoolReducer';
import { setAuthState } from '../../reducers/authReducer';



export default ()=> {
    const [school,setSchool] = useState({name:'',email:'',password:''})
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState({})
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const host = process.env.REACT_APP_HOST


    
    const inputHandler = e => {
        const { name, value } = e.target;
        setSchool({ ...school, [name]: value });
        setError({})
    };

    const toggleVisibility = () => {
        setShowPassword(prev=>!prev)
    }


    const formHandler = async e => {
        e.preventDefault()

        try {
            setLoading(true)
            const schoolDetails = await axios.post(host+'/schools', school)
            dispatch(setInitialSchool(schoolDetails.data.school))
            dispatch(setAuthState({token:schoolDetails.data.token,type:'admin'}))
            setLoading(false)
            navigate("/admin", { replace: true })//replace to prevent the user from going back into the signup page
        } catch (e) {
            setLoading(false)
            if (e.response && e.response.data.error) {
                setError(e.response.data.error);
                return 
            } else {
                setError(e.message)
            }
        }
    }

    if(error.message) {
        return(<div>{error.message}</div>)
    }

    return loading?<Circles />:(
        <div>
            <form onSubmit={formHandler}>
                <h2>Sign Up</h2>
                {error.duplicate && <p>{error.duplicate}</p>}
                <label htmlFor='name'>Full Name of School</label>
                <input 
                    value={school.name}
                    onChange={inputHandler}
                    name='name'
                    required
                />
                <label htmlFor='email'>Email</label>
                <input 
                    value={school.email}
                    onChange={inputHandler}
                    name='email'
                    type='email'
                    required
                />
                {error.email && <p>{error.email}</p>}
                <label htmlFor='password'>Password</label>
                <input 
                    value={school.password}
                    onChange={inputHandler}
                    name='password'
                    type={showPassword?'text':'password'}
                    required
                />
                <button type="button" onClick={toggleVisibility}>{showPassword?'--':'oo'}</button>
                {(error.password && !error.email) && <p>{error.password}</p>}
                <button type='submit'>Sign up</button>
            </form>
            <p>Already have an account? <Link to='/login'>Login</Link></p>
        </div>
    )
}