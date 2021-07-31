import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import { apiRoot } from '../../../config';
import axios from 'axios';
import { PlusLg, Trash, Upload } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { Modal } from 'react-bootstrap';

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

    const Diff = require('diff');
    const router = useRouter();

    // State to track the changes to fact data internally
    const [factData, setFactData] = useState(JSON.parse(JSON.stringify(props.data)));
    // State to control showing diff modal
    const [showDiffModal, setShowDiffModal] = useState(false);
    
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
            <form className={caseEditStyle.editor} key={"factEditor" + i}>
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

    // Handle upload functionality: shows the confirm changes modal
    const handleSubmit = (event) => {
        setShowDiffModal(true);
    }

    // Handles the submit functionality, after confirm changes is shown
    const handleActualSubmit = (event) => {
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
                   // Update the parent data
                   props.setData(JSON.parse(JSON.stringify(factData)));
                   // Close modal
                   setShowDiffModal(false);
                }
            }).catch(e => {
                throw e;
            });
    }

    // Ensures that this only runs when modal is mounted onto DOM
    useEffect(() => {
        // Run diff algorithm to check changes
        if (showDiffModal) {
            let span = null;
            const display = document.getElementById("modalFactContent");

            for (let i = 0; i < Math.max(props.data.length, factData.length); i++) {
                // Compare title
                let originalTitle = i < props.data.length ? props.data[i].title : "";
                let changedTitle = i < factData.length ? factData[i].title : "";
                
                const diffTitle = Diff.diffWords(originalTitle, changedTitle);
                const divTitle = document.createElement("h5");
                
                diffTitle.forEach(part => {
                    const color = part.added ? 'green' :
                        part.removed ? 'red' : 'grey';
                    span = document.createElement('span');
                    span.style.color = color;
                    span.appendChild(document.createTextNode(part.value));
                    divTitle.appendChild(span);
                });
                display.appendChild(divTitle);

                // Compare content
                let originalContent = i < props.data.length ? props.data[i].content : "";
                let changedContent = i < factData.length ? factData[i].content : "";

                const diffContent = Diff.diffWords(originalContent, changedContent);
                const divContent = document.createElement("div");

                diffContent.forEach(part => {
                    const color = part.added ? 'green' :
                        part.removed ? 'red' : 'grey';
                    span = document.createElement('span');
                    span.style.color = color;
                    span.appendChild(document.createTextNode(part.value));
                    divContent.appendChild(span);
                });
                display.appendChild(divContent);
            }
        }
    }, [showDiffModal])

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
            <Modal
                show={showDiffModal}
                onHide={() => setShowDiffModal(false)}
                dialogClassName={caseEditStyle.modalContainer}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm changes to facts</Modal.Title>
                </Modal.Header>
                <Modal.Body id="modalFactContent">
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleActualSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default FactEditor;