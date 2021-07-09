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
    for (let i = 0; i < facts.length; i++) {
        // Handle delete button functionality
        const handleDeleteSubTopic = (event) => {
            // Make sure that user does not accidentally delete an entry
            // Also remind user to save work (since execution reloads the page)
            let r = window.confirm(`Are you sure you want to delete ${facts[i].title}? (Any unsaved work on this page will be lost)`);
            if (r) {
                const data = {
                    time: new Date().toJSON()
                };
                const accessToken = localStorage.getItem("jwt-token");
                axios.delete(apiRoot + `/deleteTopic/${props.caseId}/facts/${i}`, { 
                    headers: {'Authorization': 'Bearer ' + accessToken},
                    data: data
                }).then(res => {
                    console.log(res.status);
                    if (res.status == 200) {
                        setFacts(res.data);
                    }
                }).catch(e => {
                    console.error(e);
                    if (accessToken) {
                        localStorage.removeItem("jwt-token");
                    }
                    router.push("/login");
                });
            }
        }

        // Build button to delete current sub-topic entry
       editingPortion.push(
           <Trash 
                key={"deleteFact" + i}
                size="25" 
                className={caseEditStyle.deleteTopicButton} 
                onClick={handleDeleteSubTopic}
            />
       );

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
        // Send current time over to server
        const data = {
            time: new Date().toJSON()
        };

        // Retrieve jwt token if it exists
        const accessToken = localStorage.getItem("jwt-token");

        if (!accessToken) {
            router.push("/login");
        } else {
            // Button adds an empty entry to the database
            axios.post(apiRoot + `/addNewTopic/${props.caseId}/facts`, { data }, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then(res => {
                console.log(res);
                if (res.status == 200) {
                    setFacts((() => {
                        let newFacts = facts.concat();
                        newFacts.push(res.data);
                        return newFacts;
                    })());
                }
            }).catch(e => {
                // Either token expired or fraud token
                console.error(e);
                localStorage.removeItem("jwt-token");
                router.push("/login");
            });
        }
    }
    // Add button for facts
    editingPortion.push(
        <PlusLg
            key={"addFact"} 
            size="30"
            className={caseEditStyle.addTopicButton}
            onClick={handleAddFact} 
        />
    );

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
    for (let i = 0; i < holding.length; i++) {
        // Handles the delete button functionality
        const handleDeleteSubTopic = (event) => {
            let r = window.confirm(`Are you sure you want to delete ${holding[i].title}? (Any unsaved work on this page will be lost)`);
            if (r) {
                // send current time
                const data = {
                    time: new Date().toJSON()
                };
                const accessToken = localStorage.getItem("jwt-token");
                axios.delete(apiRoot + `/deleteTopic/${props.caseId}/holding/${i}`, {
                    headers: {'Authorization': 'Bearer ' + accessToken},
                    data: data
                }).then(res => {
                    if (res.status == 200) {
                        setHolding(res.data);
                    }
                }).catch(e => {
                    console.error(e);
                    if (accessToken) {
                        localStorage.removeItem("jwt-token");
                    }
                    router.push("/login");
                });
            }
        }

        // Build button to delete current sub-topic entry
       editingPortion.push(
           <Trash 
                key={"deleteHolding" + i}
                size="25" 
                className={caseEditStyle.deleteTopicButton} 
                onClick={handleDeleteSubTopic}
            />
       );

        // Build actual text editor
        editingPortion.push(<HoldingEditor 
            key={Math.random(i)}
            caseId={props.caseId}
            index={i}
            subTopic={holding[i].title}
            content={holding[i].content}
            ratioSelector={holding[i].ratio}
            tags={holding[i].tag}
        />);
    }

    // Handler for add button
    const handleAddHolding = () => {
        // Send current time
        const data = {
            time: new Date().toJSON()
        };

        // Fetch token from local storage
        const accessToken = localStorage.getItem("jwt-token");
        // Button adds an empty entry to the database
        axios.post(apiRoot + `/addNewTopic/${props.caseId}/holding`, { data }, {
            headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(res => {
            console.log(res.status);
            if (res.status == 200) {
                setHolding((() => {
                    let newHolding = holding.concat();
                    newHolding.push(res.data);
                    console.log("Added");
                    return newHolding;
                })());
            }
        }).catch(e => {
            console.error(e);
            localStorage.removeItem("jwt-token");
            router.push("/login");
        });
    }

    // Add button for holding
    editingPortion.push(
        <PlusLg 
            key="addHolding" 
            size="30"
            className={caseEditStyle.addTopicButton}
            onClick={handleAddHolding}
        />);

    return (
        <div className={caseEditStyle.center}>
            {editingPortion}
        </div>
    );
}

export default EditorBuilder 