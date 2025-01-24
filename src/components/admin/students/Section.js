import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Class from "./ClassList.js";

export default props=> {
    const host = process.env.REACT_APP_HOST
    const token = useSelector(state=>state.auth.token)
    const [students,setStudents] = useState([])
    const classesData = props.classes
    const classes = classesData.map(each=>each.class)
    const [studentsInClass, setStudentsInClass] = useState({})

    useEffect(()=>{
        const studentFetcher = async () => {
            const studentsData = await axios.get(host+'/sectionStudents?section='+props.name, {
                headers: {
                    Authorization:'Bearer '+ token
                }
            })
            const sectionStudents = studentsData.data.students
            setStudents(sectionStudents)
        }
        studentFetcher()
    },[])

    useEffect(()=>{
        classes.forEach(eachClass=>{
            const studentsInThisClass = students.filter(student=>student.class === eachClass)
            setStudentsInClass({
                ...studentsInClass,
                [eachClass]:studentsInThisClass
            })
        })
    },[students])


    return (
        <div>
            <div>Total Number of students in {props.name} section is : {students.length}</div>
            {classes.map((eachClass,index) => <Class key={index} eachClass={eachClass} students={studentsInClass[eachClass] || []} />)}
        </div>
    )
}