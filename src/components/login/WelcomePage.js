import { useNavigate } from 'react-router-dom';

const WelcomePage = ()=>{
    const navigate = useNavigate();

    const logger = (e) => {
        const role = e.currentTarget.querySelector("span").textContent.toLowerCase();
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
            <img src='/logo.png' alt="logo" />
            <h1>Welcome to<br /> Nvolve Results</h1>
            <h2>How can I help you?</h2>
            <div>
                <button onClick={logger}><span>Check Result</span> <ion-icon name="eye-outline"></ion-icon></button>
                <button onClick={logger}><span>Input Result</span> <ion-icon name="document-outline"></ion-icon></button>
                <button onClick={logger}><span>Admin</span> <ion-icon name="person-circle-outline"></ion-icon></button>
            </div>
            <a href='https://wa.me/2349038031775' className='support'>Contact Support</a>
        </div>
    )
}

export default WelcomePage;