
import dynamic from 'next/dynamic';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import TagEditor from './TagEditor';
import { apiRoot } from '../../../config';
import axios from 'axios';
import { Upload } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';

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
    // State stores tags
    const [tags, setTags] = useState(props.tags);

    // Function to handle submit button for editor
    const handleSubmit = () => {
        // Prep ratio checkbox data
        let ratioSelector;
        if (document.getElementById("ratio" + props.index).checked) {
            ratioSelector = 1;
        } else if (document.getElementById("obiter" + props.index).checked) {
            ratioSelector = 0;
        } else if (document.getElementById("notSure" + props.index).checked) {
            ratioSelector = 2;
        }

        const data = {
            topic: subTopic,
            text: content, 
            ratio: ratioSelector,
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
                document.getElementById("holdingUpload").style.color = "black";
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
        setSubTopic(event.target.value);
        document.getElementById("holdingUpload").style.color = "red";
    }

    // Handle change of quill (main) editor box
    const handleQuillChange = (cont) => {
        setContent(cont);
        document.getElementById("holdingUpload").style.color = "red";
    }

    // To allow child TagEditor to handle updating of tags state
    const updateTags = (updated) => {
        setTags(updated);
        document.getElementById("holdingUpload").style.color = "red";
    }

    // Set quill toolbar functionalities
    const formats = ['bold', 'italic', 'underline', 'blockquote', 'list', 'bullet']
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}]
        ]
    }

    return (
        <div className={caseEditStyle.editor}>
            <input id={"holdingTitle"+props.index} className={caseEditStyle.subTopic} value={subTopic} type="text" 
            onChange={handleChange} />
            <div id={"holding"+props.index}>
                <ReactQuill 
                    theme="bubble" 
                    formats={formats}
                    modules={modules}
                    value={content} 
                    onChange={handleQuillChange} 
                    style={styling} 
                />
            </div>
            <div className={caseEditStyle.bottomHoldingContainer}>
                <TagEditor tags={tags} updateTags={updateTags} />
                <div className={caseEditStyle.ratioButton}>
                    <Form>
                        <Form.Check 
                            inline 
                            defaultChecked={props.ratioSelector == 1} 
                            label="Ratio" 
                            name="group" 
                            type="radio" 
                            id={"ratio"+props.index} 
                            />
                        <Form.Check 
                            inline 
                            defaultChecked={props.ratioSelector == 0}
                            label="Obiter" 
                            name="group" 
                            type="radio" 
                            id={"obiter"+props.index} 
                            />
                        <Form.Check 
                            inline 
                            defaultChecked={props.ratioSelector == 2}
                            label="Not sure" 
                            name="group" 
                            type="radio" 
                            id={"notSure"+props.index} 
                            />
                    </Form>
                </div>
            </div>
            <Upload 
                id="holdingUpload"
                className={caseEditStyle.editorSubmitButton} 
                size={30} 
                onClick={handleSubmit} 
            />
        </div>
    );
}

export default HoldingEditor