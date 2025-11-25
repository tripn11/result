import Student from "./Student";

const Students = props => {
    return props.students.length < 1?<p className="class-students-list">No Students in this class</p>:
    <div className="class-students-list">
        <h3><span>S/N</span><span>NAMES</span><span>ACTION</span></h3>
        {props.students.map((each,index) => <Student key = {each._id} index={index} student={each} classes={props.classes}/>)}
    </div>
}

export default Students;