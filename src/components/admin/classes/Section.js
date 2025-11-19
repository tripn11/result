import { useDispatch} from "react-redux";
import Class from "./Class";
import Grade from "./Grade";
import { setClasses } from "../../../reducers/schoolReducer";
import { setAuthState } from "../../../reducers/authReducer.js";
import codeGenerator from "../../../utilities/codeGenerator.js";
import Subject from "./Subjects.js";

const Section = props => {
    const dispatch = useDispatch();
    
    const examGrader = () => {
        return props.section.grading.reduce((examGrade,grade)=>{
            let actualGrade = grade.split("-")[1]
            if(actualGrade==='') {
                return examGrade
            }else {
                return examGrade-actualGrade;
            }
        },100)
    }

    const adder = category => {
        const code = codeGenerator(6)
        const currentData = [...props.section[category]]
        if(category==='classes'){
            currentData.push({
                code,
                class:'',
                teachersTitle:'',
                teachersName:''
            })
        }else if(category==='grading'){
            currentData.push("--"+code)
        }else if(category==='subjects') {
            currentData.push('-'+code)
        }
        dispatch(setClasses({section:props.name, category:category, update:currentData}))
        dispatch(setAuthState({classesIsModified:true}))
    }

    const updater = (update, category, identifier) => {
        let index;
        const current = [...props.section[category]]

        if(category==='classes') {
            index = current.findIndex(each=>each.code === identifier)
        }else {
            index = current.findIndex(each=>each.includes(identifier))
        }
        current.splice(index,1,update)
        dispatch(setClasses({section:props.name,category,update:current}))
        dispatch(setAuthState({classesIsModified:true}))
    }

    const remover = (category, identifier) => {
        let index;
        const current = [...props.section[category]]
        if(category==='classes') {
            index = current.findIndex(each=>each.code===identifier)
        }else {
            index = current.findIndex(each=>each.includes(identifier))
        }
        current.splice(index,1)
        dispatch(setClasses({section:props.name, category, update:current}))
        dispatch(setAuthState({classesIsModified:true}))
    }

    return (
        <div id="section-classes">
            <div className="classes-list">
                {props.section.classes.map(eachClass=>(
                    <Class key={eachClass.code} 
                    details={eachClass} section={props.name} updater={updater} remover={remover}/>
                ))}
                <button onClick={()=>adder('classes')}>Add New Class</button>
            </div>

            <div className="scale-list">
                <h3>
                    <span>Category</span>
                    <span>Scale</span>
                </h3>
                {props.section.grading.map((eachGrade,index)=>{
                    const code = eachGrade.split("-")[2];
                    if(index+1===props.section.grading.length) {
                        return (
                            <div>
                                <Grade key={code} grade={eachGrade} remover={remover} updater={updater}/>
                                <Grade key='exam' grade={"exam-"+examGrader()+"-exam"} />
                            </div>
                        )
                    }
                    return (
                        <Grade key={code} grade={eachGrade} remover={remover} updater={updater}/>
                    )
                })}

                <button onClick={()=>adder('grading')}>Add Grade</button>
            </div>

            <div className="subjects-list">
                <h3>Subjects</h3>
                {props.section.subjects.map(subject=>{
                    const code = subject.split("-")[1];
                    return (
                        <Subject key={code} subject={subject} remover={remover} updater={updater}/>
                    )
                })}
                <button onClick={()=>adder('subjects')}>Add Subject</button>
            </div>
        </div>
    )
}

export default Section;