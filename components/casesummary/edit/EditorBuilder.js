import caseEditStyle from '../../../styles/CaseEdit.module.css';
import axios from 'axios';
import { apiRoot } from '../../../config';
import { useState } from 'react';
import FactEditor from './FactEditor';
import HoldingEditor from './HoldingEditor';
import { Trash, PlusLg } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import IssuesEditor from './IssuesEditor';

// Component that encapsulates the logic behind building the fact editors
const EditorBuilder = (props) => {
    // props.caseId: Unique ID of case
    // props.facts: array of facts subtopic entries
    // props.holding: array of holding subtopic entries

    const router = useRouter();
    
    const [facts, setFacts] = useState(props.facts);
    const [issues, setIssues] = useState(props.issues);
    const [holding, setHolding] = useState(props.holding);
    
    // Used to build the editors
    var editingPortion = [];

    // Build facts
    editingPortion.push(<h3 className={caseEditStyle.header} key="factheader">Facts</h3>);

    editingPortion.push(<FactEditor 
        key="factsEditor"
        data={facts}
        setData={setFacts}
        caseId={props.caseId}
    />)

    // Build issues
    editingPortion.push(<h3 key="issuesHeader" className={caseEditStyle.header}>Issues</h3>)

    editingPortion.push(
        <IssuesEditor 
            key="issuesEditor"
            data={issues} 
            caseId={props.caseId}
            setData={setIssues} 
        />
    );

    // Build holding
    editingPortion.push(<h3 key="holdingHeader" className={caseEditStyle.header}>Holding</h3>)
    editingPortion.push(
        <HoldingEditor 
            key="holdingEditor"
            data={holding}
            setData={setHolding}
            caseId={props.caseId}
        />
    );

    return (
        <div className={caseEditStyle.center}>
            {editingPortion}
        </div>
    );
}

export default EditorBuilder 