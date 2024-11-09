import React from 'react';
import { useNavigate } from 'react-router-dom';

export default ()=>{
    const navigate = useNavigate();

    const logger = (e) => {
        const role = e.target.textContent.toLowerCase()
        if(role==='admin') {
            navigate('/login')
        }else if(role==='input result'){
            navigate("/login/teacher")
        }else {
            navigate("/login/student")
        }
    }

    return (
        <div>
            <h1>Hello Champ, Welcome to ResultHub</h1>
            <h2>How can I help you?</h2>
            <button onClick={logger}>Check Result</button>
            <button onClick={logger}>Input Result</button>
            <button onClick={logger}>Admin</button>
        </div>
    )
}
