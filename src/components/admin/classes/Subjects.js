import React,{useState, useEffect} from 'react';

export default props => {
    const [subject,code] = props.subject.split("-")
    const [subj, setSubj]= useState(subject)

    useEffect(()=>{
            setSubj(subject)
        },[props.subject])

    const changeHandler = e => {
        setSubj(e.target.value)
    }

    const updater = () => {
        props.updater(subj+"-"+code,"subjects",code)
    }

    const remover = () => {
        props.remover("subjects", code)
    }

    return (
        <div>
            <input 
                value={subj}
                onChange={changeHandler}
                onBlur={updater}
            />
            <button onClick={remover}>x</button>
        </div>
    )
}