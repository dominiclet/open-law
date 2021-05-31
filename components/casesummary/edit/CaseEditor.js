import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import caseEditStyle from '../../../styles/CaseEdit.module.css';

// ReactQuill is only imported at client side 
// due to issues with next's server-side rendering
const ReactQuill = dynamic(
    import('react-quill'),
    {
        ssr: false,
        loading: () => <p>Loading (Replace with spin animation)</p>
    }
);

const CaseEditor = (props) => {
    
    // Width needs to be fixed otherwise text causes DOM elements to resize
    const styling = {
        "width": "100%",
        "margin": "auto"
    }

    const [value, setValue] = useState(
        '# Facts<br> ## Sub-fact 1 <br> We can make something similar to Markdown <br> # Holding <br> ## Sub-holding 1 <br> So that summaries are editable as such.'
    );

    const handleSubmit = () => {
        console.log(value);
    }

    return (
        <form className={caseEditStyle.editor}>
            <h4>{props.subTopic}</h4>
            <ReactQuill theme="bubble" value={value} onChange={setValue} style={styling} />
            <Button className={caseEditStyle.editorSubmitButton} onClick={handleSubmit} variant="secondary">Finalize changes</Button>
        </form>
    );
}

export default CaseEditor;