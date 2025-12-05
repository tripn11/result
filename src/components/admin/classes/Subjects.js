import {useState, useEffect} from 'react';

const Subjects = props => {
    const [subject,code] = props.subject.split("-")
    const [subj, setSubj]= useState(subject)

    useEffect(()=>{
            setSubj(subject)
        },[props.subject])

    const changeHandler = e => {
        if (e.target.value.includes("-")) return;
        setSubj(e.target.value)
    }

    const updater = () => {
        props.updater(subj.toLowerCase()+"-"+code,"subjects",code)
    }

    const remover = () => {
        props.remover("subjects", code)
    }

    return (
        <div className='subjects'>
            <input 
                value={subj}
                onChange={changeHandler}
                onBlur={updater}
            />
            <button onClick={remover}><ion-icon name="trash-outline"></ion-icon></button>
        </div>
    )
}

export default Subjects;