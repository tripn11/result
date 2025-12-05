import {useState, useEffect} from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Loading from "../../Loading.js";
import SuccessModal from "../../modals/SuccessModal.js";
import ErrorModal from "../../modals/ErrorModal.js";
import { setAuthState, setModifiedClassNames } from "../../../reducers/authReducer.js";

const Classes = () => {
    const [loading,setLoading] = useState(false)
    const token = useSelector(state=>state.auth.token)
    const classes = useSelector(state=>state.school.classes)
    const isModified = useSelector(state=>state.auth.classesIsModified)
    const modifiedClassNames = useSelector(state=>state.auth.modifiedClassNames)
    const [duplicateClasses, setDuplicateClasses] = useState(false);
    const host = process.env.REACT_APP_HOST
    const [successModal, setSuccessModal]= useState(false)
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch()

    useEffect(()=>{
        const beforeExit = e => {
            if(isModified) {
                e.preventDefault()
                e.returnValue=""
            }
        }
        window.addEventListener("beforeunload",beforeExit)
        return () => {
            window.removeEventListener("beforeunload",beforeExit)
        }
    }, [isModified])

    useEffect(() => {
        const handleLinkClick = (e) => {
            if (!isModified) return;

            const link = e.target.closest("a[href]");
            if (!link) return;

            const isInternalClassesLink = link.pathname.startsWith('/admin/classes');

            if (isInternalClassesLink) {
                return;
            }

            const confirmLeave = window.confirm(
                "You have unsaved changes. Are you sure you want to leave this page?"
            );

            if (!confirmLeave) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        };

        document.addEventListener("click", handleLinkClick, true);

        return () => {
            document.removeEventListener("click", handleLinkClick, true);
        };
    }, [isModified]);

    useEffect(()=>{
        const allClasses = Object.values(classes)
            .flatMap(section => section.classes || [])          
            .map(item => item.class); 
        const hasDuplicate = new Set(allClasses).size !== allClasses.length;
        if(hasDuplicate) {
            setDuplicateClasses(true);
        } else {
            setDuplicateClasses(false);
        }
    }, [classes])
    
    const classesSaver = async () => {
        try{
            setLoading(true)

            Object.entries(classes).forEach(([sectionKey, section]) => {
                if (!section || !section.classes) return;

                // CASE 1: validate class names
                section.classes.forEach(cls => {
                    if (!cls.class || cls.class.trim() === "") {
                        throw new Error(
                            `A Class name is missing in ${sectionKey} section.`
                        );
                    }else if(duplicateClasses) {
                        throw new Error("Two classes cannot have the same name")
                    } 
                });

                // CASE 2: validate grading
                (section.grading || []).forEach(grade => {
                    const parts = grade.split("-");
                    if (parts.some(p => p.trim() === "")) {
                        throw new Error(
                            `A grading entry was created without a name or scale in ${sectionKey} section.`
                        );
                    }
                });

                const gradingNames = (section.grading || []).map(grade => grade.split("-")[0].trim());
                const hasDuplicate = new Set(gradingNames).size !== gradingNames.length;
                if (hasDuplicate) {
                    throw new Error(
                        `Duplicate grading names found in ${sectionKey} section.`
                    );
                }

                const total = (section.grading || [])
                    .map(grade => Number(grade.split("-")[1].trim()))
                    .reduce((acc, curr) => acc + curr, 0);

                if (total > 100) {
                    throw new Error(
                        `The total grading scale must not be above 100 in ${sectionKey} section.`
                    );
                }

                // CASE 3: validate subject name
                (section.subjects || []).forEach((sub) => {
                    const [subName] = sub.split("-");
                    if (!subName || subName.trim() === "") {
                        throw new Error(
                            `Subject name missing in ${sectionKey} section.`
                        );
                    }
                });

                const subjectNames = (section.subjects || []).map(sub => sub.split("-")[0].trim());
                const hasDuplicateSubjects = new Set(subjectNames).size !== subjectNames.length;
                if (hasDuplicateSubjects) {
                    throw new Error(
                        `Duplicate subject names found in ${sectionKey} section.`
                    );
                }
            });

            await axios.patch(host+'/schools',{classes}, {
                headers: {
                    Authorization:'Bearer '+ token,
                    modifiedClassNames: JSON.stringify(modifiedClassNames)
                }
            })

            dispatch(setAuthState({classesIsModified:false}))
            dispatch(setModifiedClassNames())
            setLoading(false)
            setSuccessModal(true)
            setTimeout(()=>setSuccessModal(false),1500)
        }catch (e) {
            setLoading(false)
            setErrorModal(true)
            setError(e.response?.data || e.message)
        }
    }

    return loading?<Loading />:(
        <div id="classes">
            <div className="section-navs">
                <NavLink to="/admin/classes" end>Nursery</NavLink>
                <NavLink to="/admin/classes/primary">Primary</NavLink>
                <NavLink to="/admin/classes/jss">Junior Secondary</NavLink>
                <NavLink to="/admin/classes/ss">Senior Secondary</NavLink>
            </div>
            <Outlet />
            <button className="save-button" onClick={classesSaver} disabled={!isModified}>Save</button>
            <SuccessModal status={successModal}/>
            <ErrorModal status={errorModal} error={error} closer={()=>setErrorModal(false)}/>
        </div>
    )
}

export default Classes;