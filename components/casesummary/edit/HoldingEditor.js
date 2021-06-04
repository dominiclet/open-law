
import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import { apiRoot } from '../../../config';
import axios from 'axios';

// ReactQuill is only imported at client side 
// due to issues with next's server-side rendering
const ReactQuill = dynamic(
    import('react-quill'),
    {
        ssr: false,
        loading: () => <p>Loading (Replace with spin animation)</p>
    }
);

const HoldingEditor = (props) => {
    
    // Width needs to be fixed otherwise text causes DOM elements to resize
    const styling = {
        "width": "100%",
        "margin": "auto"
    }

    // State stores the contents of the textbox
    const [content, setContent] = useState(props.content);
    // State stores the sub-topic title
    const [subTopic, setSubTopic] = useState(props.subTopic);

    // Function to handle submit button for editor
    const handleSubmit = () => {
        const data = {
            topic: subTopic,
            text: content 
        };
        
        // Sends a POST request to the server
        axios.post(apiRoot + `/editSubTopic/${props.caseId}/holding/${props.index}`, 
        { data })
            .then(res => {
                // Do some kind of function that informs user that entry is updated here
                console.log(res.status);
            })
    }

    // Function to handle change of sub-topic title
    const handleChange = (event) => {
        setSubTopic(event.target.value);
    }

    return (
        <form className={caseEditStyle.editor}>
            <input className={caseEditStyle.subTopic} value={subTopic} type="text" 
            onChange={handleChange} />
            <ReactQuill theme="bubble" value={content} onChange={setContent} style={styling} />
            <Button className={caseEditStyle.editorSubmitButton} onClick={handleSubmit} variant="secondary">Save</Button>
        </form>
    );
}

export default HoldingEditor;