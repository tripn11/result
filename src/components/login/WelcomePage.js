import { useNavigate } from 'react-router-dom';

const WelcomePage = ()=>{
    const navigate = useNavigate();

    const logger = (e) => {
        const role = e.target.textContent.toLowerCase()
        if(role==='admin') {
            navigate('/login')
        }else if(role==='input result') {
            navigate("/login/teacher")
        }else if(role==='check result') {
            navigate("/login/student")
        }
    }

    return (
        <div id='welcome'>
            <img src='/favicon/apple-touch-icon.png' alt="logo" />
            <h1>Welcome to<br /> Nvolve Results</h1>
            <h2>How can I help you?</h2>
            <div>
                <button onClick={logger}><span>Check Result</span> <ion-icon name="eye-outline"></ion-icon></button>
                <button onClick={logger}><span>Input Result</span> <ion-icon name="document-outline"></ion-icon></button>
                <button onClick={logger}><span>Admin</span> <ion-icon name="person-circle-outline"></ion-icon></button>
            </div>

        </div>
    )
}

export default WelcomePage;