import {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import Class from "./ClassList.js";
import { setStudentsInSection } from "../../../reducers/studentsReducer.js";

const Section =  props=> {
    const host = process.env.REACT_APP_HOST
    const token = useSelector(state=>state.auth.token)
    const studentsInSection = useSelector(state=>state.students.studentsInSection)
    const classesData = props.classes
    const classes = classesData.map(each=>each.class)
    const [studentsInClass, setStudentsInClass] = useState({})
    const dispatch = useDispatch()

    useEffect(()=>{
        const studentFetcher = async () => {
            try {
                const studentsData = await axios.get(host+'/sectionStudents?section='+props.name, {
                    headers: {
                        Authorization:'Bearer '+ token
                    }
                })
                const sectionStudents = studentsData.data.students
                dispatch(setStudentsInSection(sectionStudents))
            } catch (e) {
                console.log(e)
            }
        }
        studentFetcher()
    } ,[props.name])

    useEffect(()=>{    
        setStudentsInClass(() => {
            const updatedState = {}     
            classes.forEach(eachClass => {
                const studentsInThisClass = studentsInSection.filter(student => student.class === eachClass);
                updatedState[eachClass] = studentsInThisClass;
            });
            return updatedState;
        });
    }, [studentsInSection])

    return (
        <div>
            <div>Total Number of students in {props.name} section is : {studentsInSection.length}</div>
            {classes.map((eachClass,index) => <Class key={index} eachClass={eachClass} 
                students={studentsInClass[eachClass] || []} classes={classes} />)}
        </div>
    )
}

export default Section;