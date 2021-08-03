import dynamic from 'next/dynamic';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import TagEditor from './TagEditor';
import { apiRoot } from '../../../config';
import axios from 'axios';
import { PlusLg, Trash, Upload } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { Button, Modal } from 'react-bootstrap';

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
    // Package for diff comparison
    const Diff = require("diff");
    
    // Width needs to be fixed otherwise text causes DOM elements to resize
    const styling = {
        "width": "100%",
        "margin": "auto",
    }

    // State to store the holding info internally
    const [holding, setHolding] = useState(JSON.parse(JSON.stringify(props.data)));
    // State to control display of diff modal
    const [showDiffModal, setShowDiffModal] = useState(false);

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
        const handleEditorChange = (content, delta, source, editor) => {
            let newHolding = holding.concat();
            newHolding[i].content = content;
            setHolding(newHolding);
            // Conditional required to circumvent issue where button appears read on mount
            if (source != "api") {
                document.getElementById("holdingUpload").style.color = "red";
            }
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
            <form className={caseEditStyle.editor} key={"holdingEditor" + i}>
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
            </form>
        );
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

    // Function to handle submit (this does not actually submit, but merely brings up the diff comparison modal)
    const handleSubmit = () => {
        setShowDiffModal(true);
    }

    // Handles the actual submit functionality. This is the submit button on the diff comparison modal. 
    const handleActualSubmit = () => {
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
                    document.getElementById("holdingUpload").style.color = "black";
                    // Update the parent data
                    props.setData(JSON.parse(JSON.stringify(holding)));
                    // Close modal
                    setShowDiffModal(false);
                }
            }).catch(e => {
                throw e;
            });
    }

    // Ensures that this only runs when modal component is mounted onto DOM
    useEffect(() => {
        if (showDiffModal) {
            let span = null;
            const display = document.getElementById("modalHoldingContent");
            
            for (let i = 0; i < Math.max(props.data.length, holding.length); i++) {
                // Compare title
                let originalTitle = i < props.data.length ? props.data[i].title : "";
                let changedTitle = i < holding.length ? holding[i].title : "";
                
                const diffTitle = Diff.diffWords(originalTitle, changedTitle);
                const divTitle = document.createElement("h5");
                
                diffTitle.forEach(part => {
                    const color = part.added ? 'green' : 
                    part.removed ? 'red' : 'grey';
                    span = document.createElement('span');
                    span.style.color = color;
                    if (color == 'red') {
                        span.style.textDecoration = "line-through";
                    }
                    span.appendChild(document.createTextNode(part.value));
                    divTitle.appendChild(span);
                });
                display.appendChild(divTitle);

                // Compare content
                let originalContent = i < props.data.length ? props.data[i].content : "";
                let changedContent = i < holding.length ? holding[i].content : "";

                const diffContent = Diff.diffWords(originalContent, changedContent);
                
                const divContent = document.createElement("div");

                // Algorithm to group block deletes and block additions together.
                // BufferQueue stores additions temporarily, unloads when we reach
                // an unchanged word
                let bufferQueue = [];
                let current;
                let prevAdded;

                for (let j = 0; j < diffContent.length; j++) {
                    current = diffContent[j];
                    const color = current.added ? 'green' :
                        current.removed ? 'red' : 'grey';
                    if (color == 'green' && j != 0 && diffContent[j - 1].removed) {
                        bufferQueue.push(current);
                    } else if (color == 'grey' && current.value != " " && bufferQueue.length != 0) {
                        bufferQueue.forEach(part => {
                            const color = part.added ? 'green' : 
                                part.removed ? 'red' : 'grey';
                            span = document.createElement('span');
                            span.style.color = color;
                            span.appendChild(document.createTextNode(part.value + " "));
                            divContent.appendChild(span);
                            prevAdded = part;
                        });
                        bufferQueue = [];
                    } else if (color == 'green') {
                        bufferQueue.forEach(part => {
                            const color = part.added ? 'green' : 
                                part.removed ? 'red' : 'grey';
                            span = document.createElement('span');
                            span.style.color = color;
                            span.appendChild(document.createTextNode(part.value + " "));
                            divContent.appendChild(span);
                            prevAdded = part;
                        });
                        bufferQueue = [];
                        span = document.createElement('span');
                        span.style.color = color;
                        span.appendChild(document.createTextNode(current.value));
                        divContent.appendChild(span);
                        prevAdded = current;
                    } else {
                        span = document.createElement('span');
                        span.style.color = color;
                        if (color == 'red' || (color == 'grey' && prevAdded && prevAdded.removed && current.value == " ")) {
                            span.style.textDecoration = "line-through";
                        }
                        span.appendChild(document.createTextNode(current.value));
                        divContent.appendChild(span);
                        prevAdded = current;
                    }
                }

                display.appendChild(divContent);

                // Compare tags
                let originalTags = i < props.data.length ? props.data[i].tag.join("; ") : "";
                let changedTags = i < holding.length ? holding[i].tag.join("; ") : "";
                
                const diffTags = Diff.diffWords(originalTags, changedTags);

                const divTags = document.createElement("div");
                divTags.style.fontStyle = "italic";
                divTags.style.textAlign = "right";

                diffTags.forEach(part => {
                    const color = part.added ? 'green' : 
                        part.removed ? 'red' : 'grey';
                    span = document.createElement('span');
                    span.style.color = color;
                    if (color == 'red') {
                        span.style.textDecoration = "line-through";
                    }
                    span.appendChild(document.createTextNode(part.value));
                    divTags.appendChild(span);
                });
                display.appendChild(divTags);
            }
        }
    }, [showDiffModal]);


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
            <Modal
                show={showDiffModal}
                onHide={() => setShowDiffModal(false)}
                dialogClassName={caseEditStyle.modalContainer}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm changes to holding</Modal.Title>
                </Modal.Header>
                <Modal.Body id="modalHoldingContent"></Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleActualSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default HoldingEditor