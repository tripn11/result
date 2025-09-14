import  { useState} from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loading from '../Loading';
import ErrorModal from '../modals/ErrorModal';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Result = () => {
    const host = process.env.REACT_APP_HOST;
    const token = useSelector(state => state.auth.token);
    const {currentSession:session,currentTerm:term} = useSelector(state => state.school.termInfo);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const currentYear = new Date().getFullYear();
    const sessionOptions = [];
    const classes = Object.values(useSelector(state => state.school.classes))
                    .flatMap(section => section.classes.map(c => c.class));

    const [details, setDetails] = useState({
        type: 'ca',
        session,
        term,
        className: '',
        studentName: ''
    });

    for (let year = 2024; year <= currentYear; year++) {
        sessionOptions.push(`${year}/${year + 1}`);
    }

    const changeHandler = (e) => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value
        });
    }

    const handleSearch = async() => {
        try {
            setLoading(true);
            const response = await axios.get(host+'/schoolResult', {
                params:details,
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            setResults(response.data);          
        } catch (e) {
            setError(e.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    const downloader = async () => {
        try{
            setLoading(true);
            if (results.length === 1) {
                const fileObj = results[0].file;
                const byteArray = new Uint8Array(Object.values(fileObj));
                const blob = new Blob([byteArray], { type: "application/pdf" });
                saveAs(blob, results[0].name);
            } else {
                const zip = new JSZip();
                await Promise.all(results.map(async result => {
                    const fileObj = result.file;
                    const byteArray = new Uint8Array(Object.values(fileObj));
                    const blob = new Blob([byteArray], { type: "application/pdf" });
                    zip.file(result.name, blob);
                }));
        
                zip.generateAsync({ type: "blob" }).then((content) => {
                    saveAs(content, `${details.className}_${details.term}.zip`);
                });
            }
        }catch(e){
            setError(e.response?.data || e.message);
        }finally{
            setLoading(false);
        }
    };

    if(error) return <ErrorModal status={!!error} closer={() => setError(null)} error={error}/>
    return loading?<Loading/>:(
        <div>
            <h1>Search Results</h1>
            <div>
                <label>
                    <input
                        type="radio"
                        value="ca"
                        checked={details.type === 'ca'}
                        onChange={changeHandler}
                        name='type'
                    />
                    CA
                </label>
                <label>
                    <input
                        type="radio"
                        value="exam"
                        checked={details.type === 'exam'}
                        onChange={changeHandler}
                        name='type'
                    />
                    Exam
                </label>
            </div>
            <div>
                <label htmlFor='session'>
                    Session:
                </label>
                <select
                    type="text"
                    value={details.session}
                    onChange={changeHandler}
                    name='session'
                    id='session'
                >
                    {sessionOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor='term'>
                    Term:
                </label>
                <select
                    type="text"
                    value={details.term}
                    onChange={changeHandler}
                    name='term'
                    id='term'
                >
                    <option value='first'>first</option>
                    <option value='second'>second</option>
                    <option value='third'>third</option>
                </select>
            </div>
            <div>
                <label htmlFor='className'>Class:</label>
                <select
                    value={details.className}
                    onChange={changeHandler}
                    name='className'
                    id='className'
                    required
                >
                    <option value=''>Select Class</option>
                    {classes.map(each=><option key={each} value={each}>{each}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor='studentName'>
                    Student Name:
                    <input
                        type="text"
                        value={details.studentName}
                        onChange={changeHandler}
                        name='studentName'
                        id='studentName'
                        placeholder='Surname Firstname'
                    />
                </label>
            </div>
            {error && <p>{error}</p>}
            {results.length>0 && <p>{results.length} Results Found </p>}
            <button onClick={handleSearch}>Search</button>
            {results.length>0 && <button onClick={downloader}>Download{results.length>1?' All':''}</button>}
        </div>
    );
};

export default Result;