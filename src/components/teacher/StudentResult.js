import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from 'react';
import BackButton from "../BackButton";
import Loading from '../Loading';
import axios from 'axios';
import { updateResult } from "../../reducers/resultReducer";
import SuccessModal from "../modals/SuccessModal";
import ErrorModal from "../modals/ErrorModal";

const StudentResult = () => {
    const { id } = useParams();
    const host = process.env.REACT_APP_HOST
    const result = useSelector(state => state.results.results.find(result => result.owner === id));
    const student = useSelector(state => state.students.studentsInClass.find(student => student._id === id));
    const classDetails = useSelector(state => state.results.classDetails)
    const accessCode = useSelector(state => state.auth.token);
    const [resultType, setResultType] = useState('ca');
    const [subjects, setSubjects] = useState(result ? result.subjects : null);
    const grades = subjects ? Object.keys(Object.values(subjects)[0]) : null;
    const [updatedSubject, setUpdatedSubject] = useState("")
    const [comments, setComments] = useState({
        teachers:result.teachersComment || '', 
        principals:result.principalsComment || '',
        attendance:result.attendance || ''
    })
    const [modified, setModified] = useState(false); 
    const [success, setSuccess] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [error, setError] = useState(null);
    const totalStudents = useSelector(state => state.students.totalStudentsInClass);
    const dispatch = useDispatch();
    const initialTotal = {};
    Object.keys(subjects).forEach(subject => {
        const scores = Object.values(subjects[subject])
        initialTotal[subject] = {
            ca: scores.includes("-") ? "-":
                scores.slice(0,-1)
                .reduce((tot, val) => tot + Number(val), 0),
            total: scores.some(value => value === "-") ? "-" : 
                scores.reduce((tot, val) => tot + Number(val), 0)
        }
    })
    const [totals, setTotals] = useState(initialTotal);
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        if(!updatedSubject) return;
        const scores = Object.values(subjects[updatedSubject])
        let ca, total;
        if(scores.includes("-")){
            ca = "-";
            total = "-";
        }else {
            ca = scores.slice(0,-1).reduce((tot, val) => tot + Number(val), 0)
            total = scores.reduce((tot, val) => tot + Number(val), 0)
        }

        setTotals(prev=>({...prev,[updatedSubject]:{ca, total}}))            
    },[subjects])
    
    const handleChange = (subject, grade, value) => {
        setUpdatedSubject(subject);
        setModified(true);
        setPdfUrl(null)
        setSubjects(prevSubjects => {
            if(value==="-") {
                const sub = {};
                Object.keys(subjects[subject]).forEach(grading => {
                    sub[grading] = "-";
                })

                return {
                    ...prevSubjects,
                    [subject]: sub
                }
            }

            return (
                {
                    ...prevSubjects,
                    [subject]: {
                        ...prevSubjects[subject],
                        [grade]: value
                    }
                }
            )
        });
    };

    const commentChanger = (e) => {
        setModified(true);
        setComments({...comments, [e.target.name]: e.target.value})
        setPdfUrl(null)
    }

    const resultSaver = async () => {
        console.log(classDetails)
        console.log(classDetails.teachersTitle)
        setLoading(true);
        const finalResult = {
            ...result,
            age: student.age,
            population: totalStudents,
            subjects,
            attendance: comments.attendance,
            teachersComment: comments.teachers,
            principalsComment: comments.principals,
            timesSchoolOpened: classDetails.timesSchoolOpened,
            teachersName:classDetails.teachersName,
            teachersTitle:classDetails.teachersTitle
        }

        try {
            if(finalResult._id) {
                await axios.put(host+"/updateResult/"+finalResult._id, finalResult, {
                    headers: {
                        'Authorization': `Bearer ${accessCode}`
                    }
                });
                dispatch(updateResult({id:result.owner, result: finalResult}));
            } else {
                const updatedResult = await axios.post(host+"/addResult", finalResult, {
                    headers: {
                        'Authorization': `Bearer ${accessCode}`
                    }
                });
                dispatch(updateResult({id:result.owner, result: updatedResult.data}));
            }
            setModified(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (error) {
            setError(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    const resultViewer = async () => {
        try {
            setLoading(true)
            const response = await axios.get(host+"/result", {
                params: {
                    _id: student._id,
                    term: result.term,
                    className: result.className,
                    type: resultType
                },
                headers: {
                    Authorization: `Bearer ${accessCode}`,
                    Role:"teacher"
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

    if(loading) return <Loading />
    if(error) return <ErrorModal status={!!error} closer={() => setError(null)} error={error || "An error occurred"} />
    return !result ?  <div><BackButton /> No result found </div> :
        <div>
            <BackButton confirm={modified} />
            <div>
                <h2>{student.fullName}</h2>
                <div>
                    <input type="radio" id="ca" name="resultType" value="ca" checked={resultType === 'ca'} onChange={() => setResultType('ca')} />
                    <label htmlFor="ca">CA</label>
                    <input type="radio" id="term" name="resultType" value="term" checked={resultType === 'term'} onChange={() => setResultType('term')} />
                    <label htmlFor="term">Term</label>
                </div>

                <div>
                    <table>
                        <thead>
                            {resultType === 'ca'? 
                                <tr>
                                    <th>Subject</th>
                                    {grades
                                        .slice(0,-1)
                                        .map(grade => <th key={grade}>{grade.split("-")[0]}</th>)}
                                    <th>Total</th>
                                </tr>:
                                <tr>
                                    <th>Subject</th>
                                    <th>CA</th>
                                    <th>Exam</th>
                                    <th>Total</th>
                                </tr>
                            }
                        </thead>

                        <tbody>
                            {Object.entries(subjects).map((subject, index) => {
                                const subjectName = subject[0].split("-")[0];
                                const examMax = Number([grades[grades.length-1].split("-")[1]]);

                                return resultType === 'ca' ? (
                                    <tr key={subject}>
                                        <td>{index+1} {subjectName}</td>
                                        {grades && grades.slice(0,-1).map(grade => (
                                            <td key={grade}>
                                                <select 
                                                    value={subjects[subject[0]][grade]}
                                                    onChange={e => handleChange(subject[0], grade, e.target.value)}
                                                >
                                                    {Array.from({ length: Number(grade.split("-")[1])})
                                                        .map((_,i) => (
                                                            <option key={i} value={Number(grade.split("-")[1]) - i}>{Number(grade.split("-")[1]) - i}</option>
                                                        ))
                                                    }
                                                    <option value={0}>0</option>
                                                    <option value="-">-</option>
                                                </select>
                                            </td>
                                        ))}
                                        <td>{totals[subject[0]].ca}</td>
                                    </tr>
                                ) : (
                                    <tr key={subject}>
                                        <td>{index+1} {subjectName}</td>
                                        <td>{totals[subject[0]].ca}</td>
                                        <td>
                                            <select
                                                value={subjects[subject[0]][grades[grades.length - 1]]}
                                                onChange={e => handleChange(subject[0], grades[grades.length - 1], e.target.value)}
                                            >
                                                {Array.from({ length: examMax })
                                                    .map((_,i) => (
                                                        <option key={i} value={examMax - i}>{examMax - i}</option>
                                                    ))
                                                }
                                                <option value={0}>0</option>
                                                <option value="-">-</option>
                                            </select>
                                        </td>
                                        <td>{totals[subject[0]].total}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div>
                    <label>Attendance:</label>
                    <input 
                        type="number" 
                        value={comments.attendance} 
                        onChange={commentChanger} 
                        name="attendance" />
                </div>
                <div>
                    <div>
                        <label>Teacher's Comment:</label>
                        <textarea
                            value={comments.teachers}
                            onChange={commentChanger}
                            maxLength={300}
                            name="teachers"
                        />
                    </div>
                    <div>
                        <label>Principal's Comment:</label>
                        <textarea
                            value={comments.principals} 
                            onChange={commentChanger} 
                            maxLength={300} 
                            name="principals"
                        />
                    </div>
                </div>
                <SuccessModal status={success} message="Results saved successfully!" />
                <button onClick={resultSaver} disabled={!modified}>Save</button>
                {!modified && <button onClick={resultViewer}>View Result</button>}
                {pdfUrl && (
                    <div>
                        <button onClick={() => setPdfUrl(null)}>Close</button>
                        <iframe
                        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            width="100%"
                            height="600px"
                            style={{ border: "none" }}
                            title="Result PDF"
                        />
                    </div>
                )}
            </div>
        </div>
}

export default StudentResult;