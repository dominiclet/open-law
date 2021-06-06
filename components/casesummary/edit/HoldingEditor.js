
import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
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
    // props.caseId: Unique case ID
    // props.index: The numeric identifier for the subtopic within the category
    // props.subTopic: The sub-topic title of this entry
    // props.content: The content of this entry
    // props.isRatio: Boolean value indicating whether this entry is ratio (true) or obiter
    
    // Width needs to be fixed otherwise text causes DOM elements to resize
    const styling = {
        "width": "100%",
        "margin": "auto"
    }

    // State stores the contents of the textbox
    const [content, setContent] = useState(props.content);
    // State stores the sub-topic title
    const [subTopic, setSubTopic] = useState(props.subTopic);
    // State stores whether this sub-topic is classified ratio/obiter (default to ratio)
    const [isRatio, setIsRatio] = useState(props.isRatio ? "1" : "0");

    // Function to handle submit button for editor
    const handleSubmit = () => {
        const data = {
            topic: subTopic,
            text: content, 
            ratio: isRatio == "1" ? true : false 
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
        <div className={caseEditStyle.editor}>
            <input className={caseEditStyle.subTopic} value={subTopic} type="text" 
            onChange={handleChange} />
            <ReactQuill theme="bubble" value={content} onChange={setContent} style={styling} />
            <Button className={caseEditStyle.editorSubmitButton} onClick={handleSubmit} variant="secondary">Save</Button>
            <ButtonGroup toggle>
                <ToggleButton
                    key="1"
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value="1"
                    checked={isRatio=="1"}
                    onChange={(e) => setIsRatio(e.currentTarget.value)}
                >
                    Ratio
                </ToggleButton>
                <ToggleButton
                    key="2"
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value="0"
                    checked={isRatio=="0"}
                    onChange={(e) => setIsRatio(e.currentTarget.value)}
                >
                    Obiter
                </ToggleButton>
            </ButtonGroup>
        </div>
    );
}

export default HoldingEditor;