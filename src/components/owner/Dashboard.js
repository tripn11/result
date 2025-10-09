import { useLocation } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';
import Loading from '../Loading';
import ErrorModal from '../modals/ErrorModal';


const Dashboard = () => {
    const {schools, passCode} = useLocation().state;
    const host = process.env.REACT_APP_HOST;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handler = async e => {
        try {
            setLoading(true);
            await axios.patch(`${host}/schools/${e.target.name}`, {
                status: e.target.checked
            }, {
                headers: {'Authorization': `Bearer ${passCode}`}
            });
            
            
            const index = schools.findIndex(school => school._id === e.target.name);
            schools[index].status = e.target.checked;
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loading />;
    return (
        <div>
            <h1>Welcome Master Noble</h1>
            <h2>List of Schools</h2>
            <ol>
                {schools.map(school=> (
                    <li key={school._id}>
                        <span>{school.name}</span>
                        <input 
                            type='checkbox' 
                            checked= {school.checked} 
                            onChange={handler}
                            name={school._id}
                        />
                    </li>
                ))}
            </ol>

            <ErrorModal status={!!error} closer={()=>setError('')} error={error} />
        </div>
    )
}

export default Dashboard;