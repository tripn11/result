import React from 'react';
import { useNavigate } from 'react-router-dom';

export default ()=>{
    const navigate = useNavigate();

    const logger = (e) => {
        const role = e.target.textContent.toLowerCase()
        if(role==='admin') {
            navigate('/login')
        }else {
            navigate("/login/"+role)
        }
    }

    return (
        <div>
            <h1>Hello, Welcome Champ</h1>
            <h2>I am Result, Who are you?</h2>
            <button onClick={logger}>Admin</button>
            <button onClick={logger}>Teacher</button>
            <button onClick={logger}>Parent</button>
            <button onClick={logger}>Student</button>
        </div>
    )
}
