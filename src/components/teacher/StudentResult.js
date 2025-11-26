import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import BackButton from "../BackButton";
import Loading from '../Loading';
import axios from 'axios';
import { updateResult } from "../../reducers/resultReducer";
import SuccessModal from "../modals/SuccessModal";
import ErrorModal from "../modals/ErrorModal";
import * as pdfjs from 'pdfjs-dist/build/pdf';
import Header from "./Header";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const calcTotals = subjectObj => {
  const vals = Object.values(subjectObj);
  if(vals.includes("-")) return { ca:"-", total:"-" };

  const ca = vals.slice(0,-1).reduce((a,b)=>a+Number(b),0);
  const total = vals.reduce((a,b)=>a+Number(b),0);
  return { ca, total };
}

const StudentResult = () => {
  const { id } = useParams();
  const host = process.env.REACT_APP_HOST
  const result = useSelector(state => state.results.results.find(r => r.owner === id));
  const student = useSelector(state => state.students.studentsInClass.find(st => st._id === id));
  const classDetails = useSelector(state => state.results.classDetails)
  const accessCode = useSelector(state => state.auth.token);
  const totalStudents = useSelector(state => state.students.totalStudentsInClass);

  const dispatch = useDispatch();

  const [subjects, setSubjects] = useState(result?.subjects || {});
  const [comments, setComments] = useState({
    teachers: result.teachersComment || '',
    principals: result.principalsComment || '',
    attendance: result.attendance || ''
  });

  const initTotals = useMemo(() => {
    const subjectsTotal = {};
    Object.keys(subjects).forEach(subject => subjectsTotal[subject] = calcTotals(subjects[subject]));
    return subjectsTotal;
  },[]);

  const [totals, setTotals] = useState(initTotals);
  const [modified, setModified] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (subject, grade, value) => {
    setModified(true);
    setImageUrl(null);

    setSubjects(prev => {
      let subjectToUpdate = {...prev[subject]};

      if(value === "-"){
        Object.keys(subjectToUpdate).forEach(scale => subjectToUpdate[scale]="-");
      } else {
        subjectToUpdate[grade] = value;
      }

      const next = {...prev, [subject]:subjectToUpdate};
      setTotals(t => ({...t, [subject]: calcTotals(subjectToUpdate)}));
      return next;
    });
  }

  const commentChanger = (e) => {
    setModified(true);
    setComments({...comments, [e.target.name]:e.target.value});
    setImageUrl(null);
  }

  const resultSaver = async () => {
    setLoading(true);
    const finalResult = {
      ...result,
      age: student.age,
      population: totalStudents,
      subjects,
      attendance: comments.attendance,
      teachersComment: comments.teachers,
      principalsComment: comments.principals,
      timesSchoolOpened: classDetails.timesSchoolOpened,
      teachersName:classDetails.teachersName,
      teachersTitle:classDetails.teachersTitle
    }

    try{
      if(finalResult._id){
        await axios.put(host+"/updateResult/"+finalResult._id, finalResult,{
          headers:{ Authorization:`Bearer ${accessCode}` }
        })
        dispatch(updateResult({id:result.owner, result:finalResult}));
      } else {
        const newRes = await axios.post(host+"/addResult", finalResult,{
          headers:{ Authorization:`Bearer ${accessCode}` }
        });
        dispatch(updateResult({id:result.owner, result:newRes.data}));
      }

      setModified(false);
      setSuccess(true);
      setTimeout(()=>setSuccess(false),2000);

    }catch(e){
      setError(e.response?.data||e.message);
    }finally{
      setLoading(false);
    }
  }

  const resultViewer = async type => {
    try{
      setLoading(true);
      const response = await axios.get(host+"/result",{
        params:{ _id:student._id, term:result.term, className:result.className, type },
        headers:{ Authorization:`Bearer ${accessCode}`, Role:"teacher"},
        responseType:"arraybuffer"
      });

      const pdfData = new Uint8Array(response.data);
      const pdf = await pdfjs.getDocument({data:pdfData}).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({scale:1.5});
      const canvas = document.createElement('canvas');
      canvas.height = viewport.height; canvas.width = viewport.width;
      await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
      setImageUrl(canvas.toDataURL("image/png"));
    }catch(e){
      let msg;
      if(e.response?.data && e.response.data instanceof ArrayBuffer){
        msg = new TextDecoder().decode(e.response.data); 
      }else{
        msg = e.response?.data || e.message;
      }
      setError(msg);
    }
    finally{ setLoading(false) }
  }

  if(loading) return <Loading/>
  if(error) return <ErrorModal status={!!error} closer={()=>setError(null)} error={error||"An error occurred"}/>
  if(!result) return <div><BackButton/>No result found</div>

  return (
    <div id="student-result">
      {imageUrl && (
        <div className="actual-result">
          <img src={imageUrl} alt="Student Result"/>
          <button onClick={()=>setImageUrl(null)}>Close</button>
        </div>
      )}

      <Header content={student.fullName}/>
      <BackButton confirm={modified}/>

      <div className={`result-form ${imageUrl ? 'invincible' : ''}`}>
        {Object.entries(subjects).map(([subject,data])=>(
          <div key={subject}>
            <h3>{subject.split("-")[0]}</h3>
            {Object.entries(data).map(([grade,val]) => (
              <div key={grade} className="subject-grade">
                <label>{grade.split("-")[0]}</label>
                <select
                  value={val}
                  onChange={e => handleChange(subject, grade, e.target.value)}
                >
                  {Array.from({length:grade.split("-")[1]}).map((_,i)=>{
                    const score = Number(grade.split("-")[1])-i;
                    return <option key={score} value={score}>{ score }</option>
                  })}
                  <option value="0">0</option>
                  <option value="-">-</option>
                </select>
              </div>
            ))}
            <div>
              <div><span>CA:</span><span>{totals[subject].ca}</span></div>
              <div><span>Total:</span><span>{totals[subject].total}</span></div>
            </div>
          </div>
        ))}

        <div className="extra-details">
          <label>Attendance</label>
          <input type="number" value={comments.attendance} onChange={commentChanger} name="attendance"/>
        </div>

        <div className="extra-details">
          <label>Teacher's Comment</label>
          <textarea value={comments.teachers} onChange={commentChanger} maxLength={300} name="teachers"/>
        </div>

        <div className="extra-details">
          <label>Principal's Comment</label>
          <textarea value={comments.principals} onChange={commentChanger} maxLength={300} name="principals"/>
        </div>

        <SuccessModal status={success} message="Results saved successfully!" />
        <button onClick={resultSaver} disabled={!modified}>Save</button>
        {!modified && <button onClick={()=>resultViewer("ca")}>View CA Result</button>}
        {!modified && <button onClick={()=>resultViewer("term")}>View Term Result</button>}
      </div>
    </div>
  )
}

export default StudentResult;
