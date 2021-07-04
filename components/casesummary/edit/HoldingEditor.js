
import dynamic from 'next/dynamic';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useState } from 'react';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import TagEditor from './TagEditor';
import { apiRoot } from '../../../config';
import axios from 'axios';
import { Upload } from 'react-bootstrap-icons';
import { useRouter, withRouter } from 'next/router';

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
    // props.tags: Array of tags relevant to this subtopic holding

    const router = useRouter();
    
    // Width needs to be fixed otherwise text causes DOM elements to resize
    const styling = {
        "width": "100%",
        "margin": "auto",
    }

    // State stores the contents of the textbox
    const [content, setContent] = useState(props.content);
    // State stores the sub-topic title
    const [subTopic, setSubTopic] = useState(props.subTopic);
    // State stores whether this sub-topic is classified ratio/obiter (default to ratio)
    const [isRatio, setIsRatio] = useState(props.isRatio ? "1" : "0");
    // State stores tags
    const [tags, setTags] = useState(props.tags);

    // Function to handle submit button for editor
    const handleSubmit = () => {
        const data = {
            topic: subTopic,
            text: content, 
            ratio: isRatio == "1" ? true : false,
            tag: tags,
            time: new Date().toJSON()
        };

        // Retrieve token from local storage
        const accessToken = localStorage.getItem("jwt-token");
        
        // Sends a POST request to the server
        axios.post(apiRoot + `/editSubTopic/${props.caseId}/holding/${props.index}`, 
        { data }, {
            headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(res => {
            if (res.status == 200) {
                // Remove red glow
                document.getElementById("holdingTitle" + props.index).classList.remove(caseEditStyle.inputGlow);
                document.getElementById("holding" + props.index).classList.remove(caseEditStyle.inputGlow);
            }
        }).catch(e => {
            console.error(e);
            if (accessToken) {
                localStorage.removeItem("jwt-token");
            }
            router.push("/login");
        })
    }

    // Function to handle change of sub-topic title
    const handleChange = (event) => {
        event.target.classList.add(caseEditStyle.inputGlow);
        setSubTopic(event.target.value);
    }

    // Handle change of quill (main) editor box
    const handleQuillChange = (cont) => {
        document.getElementById("holding" + props.index).classList.add(caseEditStyle.inputGlow);
        setContent(cont);
    }

    // To allow child TagEditor to handle updating of tags state
    const updateTags = (updated) => {
        setTags(updated);
    }

    return (
        <div className={caseEditStyle.editor}>
            <input id={"holdingTitle"+props.index} className={caseEditStyle.subTopic} value={subTopic} type="text" 
            onChange={handleChange} />
            <div id={"holding"+props.index}>
                <ReactQuill theme="bubble" value={content} onChange={handleQuillChange} style={styling} />
            </div>
            <TagEditor tags={tags} updateTags={updateTags} />
            <ButtonGroup toggle className={caseEditStyle.ratioButton} >
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
            <Upload className={caseEditStyle.editorSubmitButton} size={30} onClick={handleSubmit} />
        </div>
    );
}

export default HoldingEditor