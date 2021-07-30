
import dynamic from 'next/dynamic';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import TagEditor from './TagEditor';
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
        loading: () => <p>Loading (Replace with spin animation)</p>
    }
);

const HoldingEditor = (props) => {
    // props.data: The data of all the holding subtopics
    // props.setData: Callback function to change parent state of holding subtopics
    // props.caseId: The unique case ID of this case

    const router = useRouter();
    
    // Width needs to be fixed otherwise text causes DOM elements to resize
    const styling = {
        "width": "100%",
        "margin": "auto",
    }

    // State to store the holding info internally
    const [holding, setHolding] = useState(props.data);

    var holdingBuilder = [];

    // Set quill toolbar functionalities
    const formats = ['bold', 'italic', 'underline', 'blockquote', 'list', 'bullet']
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}]
        ]
    }

    for (let i = 0; i < holding.length; i++) {

        // Handle change of sub-topic title
        const handleTopicChange = (event) => {
            let newHoldingData = holding.concat();
            newHoldingData[i].title = event.target.value;
            setHolding(newHoldingData);
            document.getElementById("holdingUpload").style.color = "red";
        }

        // Handle change of editor contents
        const handleEditorChange = (value) => {
            let newHolding = holding.concat();
            newHolding[i].content = value;
            setHolding(newHolding);
            document.getElementById("holdingUpload").style.color = "red";
        }

        // Handle update tags
        const updateTags = (updatedTags) => {
            let newHoldingData = holding.concat();
            newHoldingData[i].tag = updatedTags;
            setHolding(newHoldingData);
            document.getElementById("holdingUpload").style.color = "red";
        }

        // Handle delete subtopic
        const handleDeleteSubTopic = (event) => {
            let newHolding = holding.concat();
            newHolding.splice(i, 1);
            setHolding(newHolding);
            document.getElementById("holdingUpload").style.color = "red";
        }

        // Handle click ratio radio buttons
        const handleRatioClick = (event) => {
            let ratioValue;
            if (event.target.id.slice(0, -1) === "ratio") {
                ratioValue = 1;
            } else if (event.target.id.slice(0, -1) === "obiter") {
                ratioValue = 0;
            } else if (event.target.id.slice(0, -1) === "notSure") {
                ratioValue = 2;
            }

            let newHolding = holding.concat();
            newHolding[i].ratio = ratioValue;
            setHolding(newHolding);
            document.getElementById("holdingUpload").style.color = "red";
        }

        holdingBuilder.push(
            <div className={caseEditStyle.editor}>
                <Trash size="25" className={caseEditStyle.deleteTopicButton} onClick={handleDeleteSubTopic} />
                <input id={"holdingTitle"+i} className={caseEditStyle.subTopic} value={holding[i].title} type="text" 
                onChange={handleTopicChange} placeholder="Subtopic title" />
                <div id={"holding"+props.index}>
                    <ReactQuill 
                        theme="bubble" 
                        formats={formats}
                        modules={modules}
                        value={holding[i].content} 
                        onChange={handleEditorChange} 
                        style={styling} 
                        placeholder="Enter content here"
                    />
                </div>
                <div className={caseEditStyle.bottomHoldingContainer}>
                    <TagEditor tags={holding[i].tag} updateTags={updateTags} />
                    <div className={caseEditStyle.ratioButton}>
                        <Form>
                            <Form.Check 
                                inline 
                                defaultChecked={holding[i].ratio == 1} 
                                label="Ratio" 
                                name="group" 
                                type="radio" 
                                id={"ratio"+i} 
                                onClick={handleRatioClick}
                            />
                            <Form.Check 
                                inline 
                                defaultChecked={holding[i].ratio == 0}
                                label="Obiter" 
                                name="group" 
                                type="radio" 
                                id={"obiter"+i} 
                                onClick={handleRatioClick}
                            />
                            <Form.Check 
                                inline 
                                defaultChecked={holding[i].ratio == 2}
                                label="Not sure" 
                                name="group" 
                                type="radio" 
                                id={"notSure"+i} 
                                onClick={handleRatioClick}
                            />
                        </Form>
                    </div>
                </div>
            </div>
        );
    }

    // Function to handle submit 
    const handleSubmit = () => {

        const data = {
            holdingData: holding,
            time: new Date().toJSON()
        };

        // Retrieve token from local storage
        const accessToken = localStorage.getItem("jwt-token");
        
        // Sends a POST request to the server
        axios.post(apiRoot + `/editSubTopic/${props.caseId}/holding`, 
            data , {
                headers: {'Authorization': 'Bearer ' + accessToken}
            }).then(res => {
                if (res.status == 200) {
                    document.getElementById("holdingUpload").style.color = "red";
                }
            }).catch(e => {
                throw e;
            });
    }

    // Handle add topic
    const handleAddTopic = () => {
        let newHolding = holding.concat();
        newHolding.push({
            "title": "",
            "content": "",
            "tag": [],
            "ratio": 2
        });
        setHolding(newHolding);
        document.getElementById("holdingUpload").style.color = "red";
    }


    return (
        <div className={caseEditStyle.topicOuterContainer}>
            {holdingBuilder}
            <PlusLg
                key="addHolding"
                size="30"
                id="addHolding"
                className={caseEditStyle.addTopicButton}
                onClick={handleAddTopic}
            />
            <Upload
                size="30"
                id="holdingUpload"
                className={caseEditStyle.editorSubmitButton}
                onClick={handleSubmit}
            />
        </div>
    );
}

export default HoldingEditor