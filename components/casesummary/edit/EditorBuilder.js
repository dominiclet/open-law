import caseEditStyle from '../../../styles/CaseEdit.module.css';
import axios from 'axios';
import { apiRoot } from '../../../config';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import FactEditor from './FactEditor';
import HoldingEditor from './HoldingEditor';

// Component that encapsulates the logic behind building the fact editors
const EditorBuilder = (props) => {
    // props.caseId: Unique ID of case
    // props.facts: array of facts subtopic entries
    // props.holding: array of holding subtopic entries
    
    const [facts, setFacts] = useState(props.facts);
    const [holding, setHolding] = useState(props.holding);
    
    // Used to build the editors
    var editingPortion = [];

    // Build facts
    editingPortion.push(<h3 className={caseEditStyle.header} key="factheader">Facts</h3>);
    console.log(facts);
    for (let i = 0; i < facts.length; i++) {
        // Handle delete button functionality
        const handleDeleteSubTopic = (event) => {
            // Make sure that user does not accidentally delete an entry
            // Also remind user to save work (since execution reloads the page)
            let r = window.confirm(`Are you sure you want to delete ${facts[i].title}? (Any unsaved work on this page will be lost)`);
            if (r) {
                axios.delete(apiRoot + `/deleteTopic/${props.caseId}/facts/${i}`)
                .then(res => {
                    console.log(res.status);
                    if (res.status == 200) {
                        setFacts(res.data);
                    }
                });
            }
        }

        // Build button to delete current sub-topic entry
        editingPortion.push(<Button 
                key={"deleteFact" + i}
                className={caseEditStyle.deleteTopicButton} 
                variant="danger"
                onClick={handleDeleteSubTopic}
            >X</Button>);

        // Build editor for this sub-topic entry
        editingPortion.push(<FactEditor 
            key={Math.random(i)}
            caseId={props.caseId}
            index={i}
            subTopic={facts[i].title}
            content={facts[i].content}
        />);
    }

    // Handler for add button
    const handleAddFact = () => {
        // Button adds an empty entry to the database
        axios.post(apiRoot + `/addNewTopic/${props.caseId}/facts`)
        .then(res => {
            console.log(res.status);
            if (res.status == 200) {
                setFacts((() => {
                    let newFacts = facts.concat();
                    newFacts.push(res.data);
                    return newFacts;
                })());
            }
        });
    }
    // Add button for facts
    editingPortion.push(<Button key={"addFact"} variant="secondary" 
        className={caseEditStyle.addTopicButton}
        onClick={handleAddFact}>Add</Button>);

    // Build holding
    editingPortion.push(<h3 key="holdingHeader" className={caseEditStyle.header}>Holding</h3>)
    for (let i = 0; i < holding.length; i++) {
        // Handles the delete button functionality
        const handleDeleteSubTopic = (event) => {
            let r = window.confirm(`Are you sure you want to delete ${holding[i].title}? (Any unsaved work on this page will be lost)`);
            if (r) {
                axios.delete(apiRoot + `/deleteTopic/${props.caseId}/holding/${i}`)
                .then(res => {
                    if (res.status == 200) {
                        setHolding(res.data);
                    }
                });
            }
        }

        // Build button to delete current sub-topic entry
        editingPortion.push(<Button
            key={"deleteHolding"+i}
            className={caseEditStyle.deleteTopicButton}
            variant="danger"
            onClick={handleDeleteSubTopic}
        >X</Button>)

        // Build actual text editor
        editingPortion.push(<HoldingEditor 
            key={Math.random(i)}
            caseId={props.caseId}
            index={i}
            subTopic={holding[i].title}
            content={holding[i].content}
            isRatio={holding[i].ratio}
            tags={holding[i].tag}
        />);
    }

    // Handler for add button
    const handleAddHolding = () => {
        // Button adds an empty entry to the database
        axios.post(apiRoot + `/addNewTopic/${props.caseId}/holding`)
        .then(res => {
            if (res.status == 200) {
                setHolding((() => {
                    let newHolding = holding.concat();
                    newHolding.push(res.data);
                    return newHolding;
                })());
            }
        });
    }

    // Add button for holding
    editingPortion.push(<Button key="addHolding" variant="secondary" 
        className={caseEditStyle.addTopicButton}
        onClick={handleAddHolding}>Add</Button>);

    return (
        <div className="center">
            {editingPortion}
        </div>
    );
}

export default EditorBuilder 