import {useState} from "react";
import codeGenerator from "../../../utilities/codeGenerator"; 

const Class = props => {
    const [eachClass, setEachClass] = useState({
        code:props.details.code,
        class:props.details.class||'',
        teachersTitle:props.details.teachersTitle||'',
        teachersName:props.details.teachersName||''
    })
    const [copied, setCopied] = useState(false)

    const handler = e => {
        setEachClass({...eachClass,[e.target.name]:e.target.value})
    }

    const updater = () => {
        props.updater(eachClass,'classes',eachClass.code)
    }

    const remover = () => {
        props.remover('classes',eachClass.code)
    }

    const codeChanger = () => {
        const code = codeGenerator(7)
        setEachClass({...eachClass,code})
        props.updater({...eachClass,code}, 'classes', eachClass.code)
    }

    const copier = async () => {
        try {
            await navigator.clipboard.writeText(eachClass.code+"-"+eachClass.class)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }catch(err) {
            alert("Failed to copy: ", err);
        }
    }
   
    return (
        <div className="class">
            <input 
                value={eachClass.class}
                onChange={handler}
                name='class'
                onBlur={updater}
                placeholder="Class Name"
                required
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
                placeholder="Teacher's Name"
            />
            <div className="teachers-code">
                <input 
                    value={eachClass.code+"-"+eachClass.class}
                    name='code'
                    onBlur={updater}
                    disabled={true}
                />
                <ion-icon name="copy-outline" onClick={copier} ></ion-icon>
                <span className={`balloon ${copied ? 'copied' : ''}`}>copied</span>
            </div>

            <button onClick={codeChanger}>Change Code</button>
            <button onClick={remover}>Delete Class</button>
        </div>
    )
}

export default Class;