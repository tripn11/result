import Student from "./Student";

const Students = props => {
    return props.students.length < 1?'No Students in this class':(
        <div>
            {props.students.map((each,index) => <Student key = {each._id} index={index} student={each} classes={props.classes}/>)}
        </div>
    )
}

export default Students;