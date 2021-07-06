import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
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

const FactEditor = (props) => {

    const router = useRouter();
    
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
            text: content,
            time: new Date().toJSON()
        };

        // Retrieve token from local storage
        const accessToken = localStorage.getItem("jwt-token");

        // Sends a POST request to the server
        axios.post(apiRoot + `/editSubTopic/${props.caseId}/facts/${props.index}`, 
        { data }, {
            headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(res => {
            if (res.status == 200) {
                // Remove red glow to let user know that post was successful
                document.getElementById("factTitle" + props.index).classList.remove(caseEditStyle.inputGlow);
                document.getElementById("fact" + props.index).classList.remove(caseEditStyle.inputGlow);
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
    const handleTopicChange = (event) => {
        event.target.classList.add(caseEditStyle.inputGlow);
        setSubTopic(event.target.value);
    }

    // Function to handle change of quill editor
    const handleEditorChange = (value) => {
        document.getElementById("fact" + props.index).classList.add(caseEditStyle.inputGlow);
        setContent(value);
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
        <form className={caseEditStyle.editor}>
            <input id={"factTitle"+props.index} className={caseEditStyle.subTopic} value={subTopic} 
            type="text" onChange={handleTopicChange} />
            <div id={"fact"+props.index}>
                <ReactQuill 
                    theme="bubble" 
                    modules={modules}
                    format={formats} 
                    value={content} 
                    onChange={handleEditorChange} 
                    style={styling} 
                />
            </div>
            <Upload className={caseEditStyle.editorSubmitButton} size = {30} onClick={handleSubmit} />
        </form>
    );
}

export default FactEditor;