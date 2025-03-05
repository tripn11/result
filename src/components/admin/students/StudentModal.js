import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import axios from "axios";
import Loading from '../../Loading.js';
import { useDispatch, useSelector } from "react-redux";
import { setTotalStudentsInSchool, setStudentsInSection, editStudentInSection, removeStudentFromSection } from "../../../reducers/studentsReducer.js";
import SuccessModal from '../../SuccessModal.js'
import ErrorModal from "../../ErrorModal.js";

export default props => {
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
        class: props.actualClass
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
        props.modalCloser();
    };

    const studentSaver = async () => {
        try {
            setLoading(true);
            if(props.action==='add') {
                await axios.post(host + '/students', student, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                dispatch(setTotalStudentsInSchool('add'));
                dispatch(setStudentsInSection(student));
            }else {
                await axios.patch(host+'/students/'+student._id, student, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                dispatch(editStudentInSection(student))
            }

            setLoading(false);
            setSuccessStatus(true);
            setTimeout(() => {
                setSuccessStatus(false);
                props.modalCloser();
            }, 1500);
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
            }, 1500);
        } catch (e) {
            setLoading(false);
            setErrorStatus(true);
            setError(e.response?.data || e.message);
        }
    };

    const deleteModalController = () => {
        if(deleteModal){
            setDeleteModal(false);
        }else {
            setDeleteModal(true);
        }
    }

    return (
        <Modal
            isOpen={props.state}
            onRequestClose={closeHandler}
        >
            {loading ? <Loading /> :
                <div>
                    <button onClick={closeHandler}>Close</button>
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

                    <div>
                        <label htmlFor="active">Active</label>
                        <input
                            type="radio"
                            id="active"
                            name="status"
                            value="active"
                            checked={student.status === 'active'}
                            onChange={changeHandler}
                        />
                        <label htmlFor="graduated">Graduated</label>
                        <input
                            type="radio"
                            id="graduated"
                            name="status"
                            value="graduated"
                            checked={student.status === 'graduated'}
                            onChange={changeHandler}
                        />
                    </div>

                    {props.action === 'edit' && <button onClick={deleteModalController}>Delete student</button>}

                    <button onClick={studentSaver}>Save</button>
                    <SuccessModal status={successStatus} />
                    <ErrorModal status={errorStatus} closer={errorModalCloser} error={error} />
                
                    <Modal 
                        isOpen={deleteModal}
                        onRequestClose={deleteModalController}
                    >
                        <p>Are you sure you want to delete this Student's profile?</p>
                        <p>Please note that all the data associated with this student 
                            will be permanently deleted</p>
                        <button onClick={studentDeleter}>Yes</button>
                        <button onClick={closeHandler}>No</button>
                    </Modal>
                </div>
            }
        </Modal>
    );
};