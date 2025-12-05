import {useState,useEffect} from 'react';

const Grade = props => {
    const[name, scale, code] = props.grade.split("-")
    const [grading, setGrading] = useState({name,scale})

    useEffect(()=>{
        setGrading({name,scale})
    },[props.grade])
    
    const handler = e => {
        if(e.target.name === "scale") {
            const valid =  /^[1-9][0-9]?$/.test(e.target.value) || e.target.value === "";
            if(!valid) return;    
        }
        const {name,value} = e.target
        setGrading({
            ...grading,
            [name]:value
        })
    }

    const updater = () => {
        const newGradeName = grading.name.trim().toLowerCase();
        const grade=newGradeName+"-"+grading.scale+"-"+code;
        props.updater(grade,'grading',code)
    }

    const remover = () => {
        props.remover('grading',code)
    }

    if(props.remover) {
        return (
            <div className='grade'>
                <input 
                    value={grading.name}
                    onChange={handler}
                    onBlur={updater}
                    name="name"
                    required
                />
    
                <input 
                    value={grading.scale}
                    onChange={handler}
                    onBlur={updater}
                    name="scale"
                    required
                />
                <button onClick={remover}><ion-icon name="trash-outline"></ion-icon></button>
            </div>
        )
    }else {
        return(
            <div className='grade'>
                <input value={name}/>
                <input value={scale}/>
            </div>
        )
    }
    
}

export default Grade;