import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from '../../reducers/authReducer';
import axios from 'axios';
import Loading from '../Loading';
import ErrorModal from "../modals/ErrorModal";
import * as pdfjs from 'pdfjs-dist/build/pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;



const Student = () => {
    const student = useSelector(state => state.students.student);
    const accessCode = useSelector(state => state.auth.token);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const host = process.env.REACT_APP_HOST;
    const [details, setDetails] = useState({
        class: student.class,
        term: student.term,
        type: 'term'
    });

    const changeHandler = e => {
        const { name, value } = e.target;
        if (name === "type") {
            setDetails(prev => ({
                ...prev,
                type: e.target.checked ? 'term' : "ca"
            }))
        } else {
            setDetails(prev => ({
                ...prev,
                [name]: value
            }));
        }

    };

    const resultViewer = async () => {
        try {
            setLoading(true);

            const response = await axios.get(host + "/result", {
                params: {
                    term: details.term,
                    className: details.class,
                    type: details.type,
                },
                headers: {
                    Authorization: `Bearer ${accessCode}`,
                    Role: "student"
                },
                responseType: "arraybuffer"
            });


            const pdfData = new Uint8Array(response.data);
            const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
            
            const page = await pdf.getPage(1);

            const viewport = page.getViewport({ scale:1.5 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext).promise;

            const imgDataUrl = canvas.toDataURL('image/png');
            setImageUrl(imgDataUrl);
        } catch (e) {
            setError(e.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    if (error) return <ErrorModal status={!!error} closer={() => setError(null)} error={error || "An error occurred"} />
    if (loading) return <Loading />
    
    return (
        <div id="student">
            {imageUrl && (
                 <div className="actual-result">
                    <img src={imageUrl} alt="Student Result" />
                    <button onClick={()=>setImageUrl(null)}>Close</button>
                 </div>
            )}
            
            <header>
                <h1>{student.schoolName}</h1>
            </header>

            <p>Welcome {student.fullName}</p>
            
            {!imageUrl && <div className="fx-block">
                <div className="toggle">
                    <div>
                        <input
                            type="checkbox"
                            id="toggles"
                            name='type'
                            checked={details.type === "term"}
                            onChange={changeHandler}
                        />
                        <div data-unchecked="TERM" data-checked="CA"></div>
                    </div>
                </div>
            </div>}

            <div className="filters">
                <label htmlFor="class">Class</label>
                <select
                    id="class"
                    name="class"
                    value={details.class}
                    onChange={changeHandler}
                >
                    {student.classes.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="filters">
                <label htmlFor="term">Term</label>
                <select
                    id="term"
                    name="term"
                    value={details.term}
                    onChange={changeHandler}
                >
                    <option value="first">First</option>
                    <option value="second">Second</option>
                    <option value="third">Third</option>
                </select>
            </div>

            <div className="student-buttons">
                <button onClick={resultViewer}>View Result</button>
                <button onClick={() => dispatch(logout())}>Logout</button>
            </div>
        </div>
    );
}

export default Student;