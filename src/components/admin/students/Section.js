import React, {useEffect} from "react";
import axios from "axios";

export default ()=> {
    const host = process.env.REACT_APP_HOST

    useEffect(()=>{
        const studentFetcher = async section => {
            const studentsData = await axios.get(host+'/sectionStudents?section='+section)
            const students = studentsData.data
            
        }
    })
    return (
        <div>

        </div>
    )
}