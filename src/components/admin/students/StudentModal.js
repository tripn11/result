import { useState, useEffect } from "react";
import Modal from 'react-modal';
import axios from "axios";
import Loading from '../../Loading.js';
import { useDispatch, useSelector } from "react-redux";
import { setTotalStudentsInSchool, setStudentsInSection, editStudentInSection, removeStudentFromSection } from "../../../reducers/studentsReducer.js";
import SuccessModal from '../../modals/SuccessModal.js'
import ErrorModal from "../../modals/ErrorModal.js";
import codeGenerator from "../../../utilities/codeGenerator.js";

const StudentModal = props => {
    const host = process.env.REACT_APP_HOST;
    const token = useSelector(state => state.auth.token);
    const schoolClasses = useSelector(state => state.school.classes);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successStatus, setSuccessStatus] = useState(false);
    const [errorStatus, setErrorStatus] = useState(false);
    const [classes, setClasses] = useState([]);
    const dispatch = useDispatch();
    const [deleteModal, setDeleteModal] = useState(false);
    const [changed, setChanged] = useState(false);
    const [copied, setCopied] = useState(false)

    const today = new Date().toISOString().split('T')[0];
    
    const initialStudent = {
        name: {
            surName: '',
            firstName: '',
            otherName: ''
        },
        sex: 'male',
        dateOfBirth: '',
        height: '',
        weight: '',
        status: 'active',
        class: props.actualClass,
    };

    const [student, setStudent] = useState(initialStudent);

    useEffect(() => {
        if (props.student) {
            const dateOfBirth = new Date(props.student.dateOfBirth).toISOString().split('T')[0];
            setStudent({...props.student,dateOfBirth});
        }
    }, [props.student]);

    useEffect(() => {
        const section = Object.keys(schoolClasses); 
        const classes = [];
        section.forEach(eachSection => {
            const sectionClasses = schoolClasses[eachSection].classes.map(each => each.class);
            classes.push(...sectionClasses);
        });
        setClasses(classes);
    }, [schoolClasses]);

    useEffect(() => {
        if(props.actualClass){
            setStudent(prevState => ({ ...prevState, class: props.actualClass }));
        }
    }, [props.actualClass]);

    const changeHandler = e => {
        setChanged(true);
        const { name, value } = e.target;

        if (name === 'weight' || name === 'height') {
            const regex = /^([1-9][0-9]{0,2})?$/;
            const numericValue = Number(value);

            if (!(value === "" || (regex.test(value) && numericValue <= 500))) {
                return;
            }
        }

        if (['firstName', 'surName', 'otherName'].includes(name)) {
            setStudent(prevState => ({
                ...prevState,
                name: {
                    ...prevState.name,
                    [name]: value
                }
            }));
            return;
        }

        setStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const closeHandler = () => {
        if (props.student) {
            const dateOfBirth = new Date(props.student.dateOfBirth).toISOString().split('T')[0];
            setStudent({...props.student,dateOfBirth});
        }
        props.modalCloser();
    };

    const studentSaver = async () => {
        try {
            setLoading(true);
            if(props.action==='add') {
                const newStudent = await axios.post(host + '/students', student, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                dispatch(setTotalStudentsInSchool('add'));
                dispatch(setStudentsInSection(newStudent.data));
                setStudent(initialStudent);
            }else {
                await axios.patch(host+'/students/'+student._id, student, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                dispatch(editStudentInSection(student))
                const inSection = props.classes.includes(student.class);
                if(!inSection) {
                    dispatch(removeStudentFromSection(student._id));
                }
            }

            setChanged(false);
            setLoading(false);
            setSuccessStatus(true);
            setTimeout(() => {
                setSuccessStatus(false);
                props.modalCloser();
            }, 2500);
        } catch (e) {
            setLoading(false);
            setErrorStatus(true);
            setError(e.response?.data || e.message);
        }
    };

    const errorModalCloser = () => {
        setErrorStatus(false);
    };

    const studentDeleter = async () => {
        try {
            setLoading(true);
            await axios.delete(host + '/students/' + student._id, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            dispatch(setTotalStudentsInSchool('remove'));
            dispatch(removeStudentFromSection(student._id));
            setLoading(false);
            setSuccessStatus(true);
            setTimeout(() => {
                setSuccessStatus(false);
                props.modalCloser();
            }, 2500);
        } catch (e) {
            setLoading(false);
            setErrorStatus(true);
            setError(e.response?.data || e.message);
        }
    };

    const codeChanger = () => {
        setChanged(true);
        setStudent(prev=>({...prev,code:codeGenerator(7)}))
    }

    const copier = async () => {
        try {
            await navigator.clipboard.writeText(student.code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }catch(err) {
            alert("Failed to copy: ", err);
        }
    }

    return (
        <Modal
            isOpen={props.state}
            onRequestClose={closeHandler}
            className="student-modal"
            overlayClassName="student-modal-overlay"
        >
            {loading ? <Loading /> :
                <div className="student-modal-content">
                    <button onClick={closeHandler}><ion-icon name="close-circle-outline"></ion-icon></button>
                    <h2>{props.action} student</h2>

                    <div>
                        <label htmlFor="surName">SurName</label>
                        <input id="surName" name="surName" value={student.name.surName} onChange={changeHandler} />
                    </div>

                    <div>
                        <label htmlFor="firstName">First Name</label>
                        <input id="firstName" name="firstName" value={student.name.firstName} onChange={changeHandler} />
                    </div>

                    <div>
                        <label htmlFor="otherName">Other Name</label>
                        <input id="otherName" name="otherName" value={student.name.otherName} onChange={changeHandler} />
                    </div>

                    <div>
                        <label htmlFor="sex">Sex</label>
                        <select id="sex" name="sex" value={student.sex} onChange={changeHandler}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                            id="dateOfBirth" name="dateOfBirth" type="date" max={today}
                            value={student.dateOfBirth} onChange={changeHandler}
                        />
                    </div>

                    {props.action === 'edit' && 
                        <div>
                            <label htmlFor="class">Class</label>
                            <select id="class" name="class" value={student.class} onChange={changeHandler}>
                                {classes.map(eachClass => {
                                    if(eachClass === student.class){
                                        return <option key={eachClass} value={eachClass} selected>{eachClass}</option>
                                    }else{
                                        return <option key={eachClass} value={eachClass}>{eachClass}</option>
                                    }
                                })}
                            </select>
                        </div>
                    }

                    <div>
                        <label htmlFor="height">Height</label>
                        <input id="height" name="height" value={student.height} onChange={changeHandler} />
                        <span>cm</span>
                    </div>

                    <div>
                        <label htmlFor="weight">Weight</label>
                        <input id="weight" name="weight" value={student.weight} onChange={changeHandler} />
                        <span>kg</span>
                    </div>

                    <div className="status">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="status"
                                value="active"
                                checked={student.status === 'active'}
                                onChange={changeHandler}
                            />
                            <span>Active</span>
                        </label>

                        <label className="radio-label">
                            <input
                                type="radio"
                                name="status"
                                value="graduated"
                                checked={student.status === 'graduated'}
                                onChange={changeHandler}
                            />
                            <span>Graduated</span>
                        </label>
                    </div>

                    {props.action === 'edit' && 
                        <div className="code-display">
                            <div>
                                <span>{student.code}</span>
                                <ion-icon name="copy-outline" onClick={copier} ></ion-icon>
                                {copied && <span className="balloon">copied</span>}
                            </div>
                            <button onClick={codeChanger}>Change Code</button>
                        </div>
                    }
                    <button className="student-saver" onClick={studentSaver} disabled={!changed}>Save</button>
                    {props.action === 'edit' && <button className="student-deleter" onClick={()=>setDeleteModal(prev=>!prev)}>Delete student</button>}
                    
                    <SuccessModal status={successStatus} message={`Student data has been ${props.action}ed successfully!`}/>
                    <ErrorModal status={errorStatus} closer={errorModalCloser} error={error} />
                
                    <Modal 
                        isOpen={deleteModal}
                        onRequestClose={()=>setDeleteModal(false)}
                        className="delete-modal"
                        overlayClassName="delete-modal-overlay"
                    >
                        <div className="delete-modal-content">
                            <p>Are you sure you want to delete this Student's profile?</p>
                            <p>Please note that all the data associated with this student 
                                will be permanently deleted</p>
                            <div className="button-group">
                                <button onClick={studentDeleter}>Yes</button>
                                <button onClick={()=>setDeleteModal(false)}>No</button>
                            </div>
                        </div>
                    </Modal>
                </div>
            }
        </Modal>
    );
};

export default StudentModal;