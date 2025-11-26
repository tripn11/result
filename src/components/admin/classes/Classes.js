import {useState, useEffect} from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Loading from "../../Loading.js";
import SuccessModal from "../../modals/SuccessModal.js";
import ErrorModal from "../../modals/ErrorModal.js";
import { setAuthState } from "../../../reducers/authReducer.js";

const Classes = () => {
    const [loading,setLoading] = useState(false)
    const token = useSelector(state=>state.auth.token)
    const classes = useSelector(state=>state.school.classes)
    const isModified = useSelector(state=>state.auth.classesIsModified)
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
                    }
                });

                // CASE 2: validate grading
                (section.grading || []).forEach((grade) => {
                    const parts = grade.split("-");
                    if (parts.some(p => p.trim() === "")) {
                        throw new Error(
                            `A grading entry was created without a name or scale in ${sectionKey} section.`
                        );
                    }
                });

                // CASE 3: validate subject name
                (section.subjects || []).forEach((sub) => {
                    const [subName] = sub.split("-");
                    if (!subName || subName.trim() === "") {
                        throw new Error(
                            `Subject name missing in ${sectionKey} section.`
                        );
                    }
                });
            });

            await axios.patch(host+'/schools',{classes}, {
                headers: {
                    Authorization:'Bearer '+ token
                }
            })
            setLoading(false)
            setSuccessModal(true)
            dispatch(setAuthState({classesIsModified:false}))
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