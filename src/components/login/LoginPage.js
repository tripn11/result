import React, {useState} from "react";
import { useParams } from "react-router-dom";

export default () => {
    const [accessCode, setAccessCode] = useState("")
    const { role } = useParams();
    const identity = role.toUpperCase()

    const grantAccess = () => {
        console.log('access granted')
    }
    
    return (
        <div>
            <h1>{identity}</h1>
            <input 
                value={accessCode}
                onChange={e=>setAccessCode(e.target.value)}
            />
            <button onClick={grantAccess}>Enter</button>
        </div>
    )
}