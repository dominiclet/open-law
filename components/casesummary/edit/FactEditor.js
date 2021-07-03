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
                // Do some kind of function that informs user that entry is updated here
                console.log(res.status);
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
        setSubTopic(event.target.value);
    }

    return (
        <form className={caseEditStyle.editor}>
            <input className={caseEditStyle.subTopic} value={subTopic} 
            type="text" onChange={handleTopicChange} />
            <ReactQuill theme="bubble" value={content} onChange={setContent} style={styling} />
            <Upload className={caseEditStyle.editorSubmitButton} size = {30} onClick={handleSubmit} />
        </form>
    );
}

export default FactEditor;