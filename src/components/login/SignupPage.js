import React,{useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { Circles } from "react-loader-spinner";
import { setBasics } from '../../reducers/schoolReducer';
import { setAuthState } from '../../reducers/authReducer';



export default ()=> {
    const [school,setSchool] = useState({name:'',email:'',password:''})
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const inputHandler = e => {
        const { name, value } = e.target;
        setSchool({ ...school, [name]: value });
        setErrors('')
    };

    const toggleVisibility = () => {
        setShowPassword(prev=>!prev)
    }

    const formHandler = async e => {
        e.preventDefault()

        try {
            setLoading(true)
            const schoolDetails = await axios.post('http://localhost:5000/schools', school)
            dispatch(setBasics(schoolDetails.school))
            dispatch(setAuthState({auth:true,code:schoolDetails.token,type:'admin'}))
            setLoading(false)
            navigate("/admin", { replace: true })//replace to prevent the user from going back into the signup page
        } catch (e) {
            setLoading(false)
            if (e.response && e.response.data.errors) {
                setErrors(e.response.data.errors);
                return 
            } else {
                setErrors(e)
            }
        }
    }

    if(loading) {
        return <Circles />
    }

    return (
        <div>
            <form onSubmit={formHandler}>
                <h2>Sign Up</h2>
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
                {errors.email && <p>{errors.email}</p>}
                <label htmlFor='password'>Password</label>
                <input 
                    value={school.password}
                    onChange={inputHandler}
                    name='password'
                    type={showPassword?'text':'password'}
                    required
                />
                {(errors.password && !errors.email) && <p>{errors.password}</p>}
                <button type="button" onClick={toggleVisibility}>{showPassword?'--':'oo'}</button>
                <button type='submit'>Sign up</button>
            </form>
            <p>Already have an account? <Link to='/login'>Login</Link></p>
        </div>
    )
}