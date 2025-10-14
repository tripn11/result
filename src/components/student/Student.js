import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from '../../reducers/authReducer';
import axios from 'axios';
import Loading from '../Loading';
import ErrorModal from "../modals/ErrorModal";

const Student = () => {
    const student = useSelector(state => state.students.student);
    const accessCode = useSelector(state => state.auth.token);
    const [pdfUrl, setPdfUrl] = useState(null);
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
        if(name==="type") {
            setDetails(prev => ({
                ...prev,
                type:e.target.checked?'term':"ca"
            }))
        }else {
            setDetails(prev => ({
                ...prev,
                [name]: value
            }));
        }

    };

    const resultViewer = async () => {
        try {
            setLoading(true);
            const response = await axios.get(host+"/result", {
                params: {
                    term:details.term,
                    className: details.class,
                    type: details.type,
                },
                headers: {
                    Authorization: `Bearer ${accessCode}`,
                    Role:"student"
                },
            });
            const fileObj = response.data[0].file;
            const byteArray = new Uint8Array(Object.values(fileObj));
            const blob = new Blob([byteArray], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(blob);
            setPdfUrl(fileURL);

        } catch (e) {
            setError(e.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    if(error) return <ErrorModal status={!!error} closer={() => setError(null)} error={error || "An error occurred"} />
    if(loading) return <Loading />
    return (
        <div id="student">
            <header>
                <h1>{student.schoolName}</h1>
            </header>

            <p>Welcome {student.fullName}</p>

            <div className="fx-block">
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
            </div>

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

            {pdfUrl && (
                    <div className="actual-result">
                        <iframe
                        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            width="100%"
                            height="600px"
                            style={{ border: "none" }}
                            title="Result PDF"
                        />
                        <button onClick={() => setPdfUrl(null)}>Close</button>
                    </div>
                )}
        </div>
    );
}

export default Student;
