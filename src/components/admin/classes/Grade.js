import {useState,useEffect} from 'react';

const Grade = props => {
    const[name, scale, code] = props.grade.split("-")
    const [grading, setGrading] = useState({name,scale})

    useEffect(()=>{
        setGrading({name,scale})
    },[props.grade])
    
    const handler = e => {
        const {name,value} = e.target
        setGrading({
            ...grading,
            [name]:value
        })
    }

    const updater = () => {
        const grade=grading.name+"-"+grading.scale+"-"+code;
        props.updater(grade,'grading',code)
    }

    const remover = () => {
        props.remover('grading',code)
    }

    if(props.remover) {
        return (
            <div>
                <input 
                    value={grading.name}
                    onChange={handler}
                    onBlur={updater}
                    name="name"
                />
    
                <input 
                    value={grading.scale}
                    onChange={handler}
                    onBlur={updater}
                    name="scale"
                />
                <button onClick={remover}>x</button>
            </div>
        )
    }else {
        return(
            <div>
                <input value={name}/>
                <input value={scale}/>
            </div>
        )
    }
    
}

export default Grade;