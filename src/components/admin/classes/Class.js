import React, {useState} from "react";

export default props => {
    const [eachClass, setEachClass] = useState({
        code:props.details.code,
        class:props.details.class||'',
        teachersTitle:props.details.teachersTitle||'',
        teachersName:props.details.teachersName||''
    })

    const handler = e => {
        setEachClass({...eachClass,[e.target.name]:e.target.value})
    }

    const updater = () => {
        props.updater(eachClass,'classes',eachClass.code)
    }

    const remover = () => {
        props.remover('classes',eachClass.code)
    }
   
    return (
        <div>
            <input 
                value={eachClass.class}
                onChange={handler}
                name='class'
                onBlur={updater}
            />
            <select value={eachClass.teachersTitle} name="teachersTitle" onChange={handler} onBlur={updater}>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
            </select>
            <input 
                value={eachClass.teachersName}
                onChange={handler}
                name='teachersName'
                onBlur={updater}
            />
            <button onClick={remover}>x</button>
        </div>
    )
}