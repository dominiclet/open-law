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
    editingPortion.push(<h3 className={caseEditStyle.header}>Facts</h3>);
    for (let i = 0; i < facts.length; i++) {
        // Handle delete button functionality
        const handleDeleteSubTopic = () => {
            axios.delete(apiRoot + `/deleteTopic/${props.caseId}/facts/${i}`)
            .then(res => {
                console.log(res.status);
                if (res.status == 200) {
                    setFacts(res.data);
                    console.log(facts);
                }
            });
        }

        // Build button to delete current sub-topic entry
        editingPortion.push(<Button 
                className={caseEditStyle.deleteTopicButton} 
                variant="danger"
                onClick={handleDeleteSubTopic}
            >X</Button>);

        // Build editor for this sub-topic entry
        editingPortion.push(<FactEditor 
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
    editingPortion.push(<Button variant="secondary" 
        className={caseEditStyle.addTopicButton}
        onClick={handleAddFact}>Add</Button>);

    // Build holding
    editingPortion.push(<h3 className={caseEditStyle.header}>Holding</h3>)
    for (let i = 0; i < holding.length; i++) {
        editingPortion.push(<HoldingEditor 
            caseId={props.caseId}
            index={i}
            subTopic={holding[i].title}
            content={holding[i].content}
        />);
    }

    // Add button for holding
    editingPortion.push(<Button variant="secondary" 
        className={caseEditStyle.addTopicButton}>Add</Button>);

    return (
        <div className="center">
            {editingPortion}
        </div>
    );
}

export default EditorBuilder 