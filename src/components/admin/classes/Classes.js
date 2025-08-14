import {useState, useEffect} from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Loading from "../../Loading.js";
import SuccessModal from "../modals/SuccessModal.js";
import ErrorModal from "../modals/ErrorModal.js";
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
    
    const classesSaver = async () => {
        try{
            setLoading(true)
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
        <div>
            <div>
                <NavLink to="/admin/classes">Nursery</NavLink>
                <NavLink to="/admin/classes/primary">Primary</NavLink>
                <NavLink to="/admin/classes/jss">Junior Sec</NavLink>
                <NavLink to="/admin/classes/ss">Senior Sec</NavLink>
            </div>
            <Outlet />
            <SuccessModal status={successModal}/>
            <ErrorModal status={errorModal} error={error} closer={()=>setErrorModal(false)}/>
            <button onClick={classesSaver} disabled={!isModified}>Save</button>
        </div>
    )
}

export default Classes;