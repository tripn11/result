import  { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loading from '../Loading';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default () => {
    const host = process.env.REACT_APP_HOST;
    const token = useSelector(state => state.auth.token);
    const {currentSession:session,currentTerm:term} = useSelector(state => state.school.termInfo);
    const classes = useSelector(state => state.school.classes);
    const [allClasses, setAllClasses] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const currentYear = new Date().getFullYear();
    const sessionOptions = [];
    
    const [parameters, setParameters] = useState({
        type: 'ca',
        session,
        term,
        className: '',
        studentName: ''
    });

    for (let year = 2025; year <= currentYear; year++) {
        sessionOptions.push(`${year}/${year + 1}`);
    }

    useEffect(() => {
        const totalClasses = [];
        const sections = Object.keys(classes);
        sections.forEach(section=>{
            classes[section].classes.forEach(each=>totalClasses.push(each.class))
        })
        setAllClasses(totalClasses);
    }, []);

    const changeHandler = (e) => {
        setParameters({
            ...parameters,
            [e.target.name]: e.target.value
        });
    }

    const handleSearch = async() => {
        try {
            setLoading(true);
            const results = await axios.post(host+'/finalResult', parameters, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            setResults(results.data);          
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
                const blob = new Blob([new Uint8Array(results[0].file.data)], { type: "application/pdf" });
                saveAs(blob, results[0].name);
            } else {
                const zip = new JSZip();
                await Promise.all(results.map(async pdf => {
                    const blob = new Blob([new Uint8Array(pdf.file.data)], { type: "application/pdf" });
                    zip.file(pdf.name, blob);
                }));
        
                zip.generateAsync({ type: "blob" }).then((content) => {
                    saveAs(content, "Results.zip");
                });
            }
        }catch(e){
            setError(e.message);
        }finally{
            setLoading(false);
        }
    };

    return loading?<Loading/>:(
        <div>
            <h1>Search Results</h1>
            <div>
                <label>
                    <input
                        type="radio"
                        value="ca"
                        checked={parameters.type === 'ca'}
                        onChange={changeHandler}
                        name='type'
                    />
                    CA
                </label>
                <label>
                    <input
                        type="radio"
                        value="exam"
                        checked={parameters.type === 'exam'}
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
                    value={parameters.session}
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
                        value={parameters.term}
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
                <label htmlFor='className'>
                    Class:
                </label>
                <select
                    value={parameters.className}
                    onChange={changeHandler}
                    name='className'
                    id='className'
                    required
                >
                    <option value=''>Select Class</option>
                    {allClasses.map(each=><option key={each} value={each}>{each}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor='studentName'>
                    Student Name:
                    <input
                        type="text"
                        value={parameters.studentName}
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
