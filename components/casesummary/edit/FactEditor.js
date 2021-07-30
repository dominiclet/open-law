import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import { apiRoot } from '../../../config';
import axios from 'axios';
import { PlusLg, Trash, Upload } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';

// ReactQuill is only imported at client side 
// due to issues with next's server-side rendering
const ReactQuill = dynamic(
    import('react-quill'),
    {
        ssr: false,
        loading: () => <p>Loading...</p>
    }
);

const FactEditor = (props) => {
    // props.data: data of all facts
    // props.setData: Call back function to change state of facts in parent
    // props.caseId: Unique ID of case

    const router = useRouter();

    // State to track the changes to fact data internally
    const [factData, setFactData] = useState(props.data);
    
    // Width needs to be fixed otherwise text causes DOM elements to resize
    const styling = {
        "width": "100%",
        "margin": "auto"
    }

    // Set quill toolbar functionalities
    const formats = ['bold', 'italic', 'underline', 'blockquote', 'list', 'bullet']
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}]
        ]
    }

    var factBuilder = [];

    for (let i = 0; i < factData.length; i++) {
        // Function to handle change of sub-topic title
        const handleTopicChange = (event) => {
            let newFactData = factData.concat();
            newFactData[i].title = event.target.value;
            setFactData(newFactData);
            document.getElementById("factsUpload").style.color = "red";
        }

        // Function to handle change of sub-topic contents
        const handleEditorChange = (value) => {
            let newFactData = factData.concat();
            newFactData[i].content = value;
            setFactData(newFactData);
            document.getElementById("factsUpload").style.color = "red";
        }

        // Handle delete subtopic
        const handleDeleteSubTopic = (event) => {
            let newFactData = factData.concat();
            newFactData.splice(i, 1);
            setFactData(newFactData);
            document.getElementById("factsUpload").style.color = "red";
        }

        factBuilder.push(
            <form className={caseEditStyle.editor}>
                <Trash size="25" className={caseEditStyle.deleteTopicButton} onClick={handleDeleteSubTopic} />
                <input id={"factTitle"+i} className={caseEditStyle.subTopic} value={factData[i].title} 
                type="text" onChange={handleTopicChange} placeholder="Subtopic title" />
                <div id={"fact"+props.index}>
                    <ReactQuill 
                        theme="bubble" 
                        modules={modules}
                        format={formats} 
                        value={factData[i].content} 
                        onChange={handleEditorChange} 
                        style={styling} 
                        placeholder="Enter content here"
                    />
                </div>
            </form>
        );
    }

    // Handle add topic functionality
    const handleAddTopic = (event) => {
        let newFactData = factData.concat();
        newFactData.push({
            "title": "",
            "content": ""
        });
        setFactData(newFactData);
        document.getElementById("factsUpload").style.color = "red";
    }

    // Handle submit functionality
    const handleSubmit = (event) => {
        const data = {
            factData: factData,
            time: new Date().toJSON()
        }

        axios.post(apiRoot + `/editSubTopic/${props.caseId}/facts`,
            data, {
                headers: {'Authorization': 'Bearer ' + localStorage.getItem("jwt-token")}
            }).then(res => {
                if (res.status == 200) {
                   document.getElementById("factsUpload").style.color = "black";
                }
            }).catch(e => {
                throw e;
            });
    }

    return (
        <div className={caseEditStyle.topicOuterContainer}>
            {factBuilder}
            <PlusLg 
                className={caseEditStyle.addTopicButton} 
                key="addTopic"
                size="30"
                onClick={handleAddTopic}
            />
            <Upload
                size="30"
                id="factsUpload"
                className={caseEditStyle.editorSubmitButton}
                onClick={handleSubmit}
            />
        </div>
    );
}

export default FactEditor;