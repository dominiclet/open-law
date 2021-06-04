import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import { useState } from 'react';
import { apiRoot } from '../../../config';
import axios from 'axios';

const TitleEditor = (props) => {
    // props.caseId: Unique ID of case
    // props.caseName: String of the case name
    // props.citation: Array of citations

    // Jumotron styling (Reduce padding for Jumbotron)
    const jumboStyle = {
        "padding": "1rem 2rem",
        "width": "60vw",
        "margin": "auto",
        "minWidth": "1000px",
        "height": "175px"
    };

    // Button style
    const buttonStyle ={
        "float": "right"
    };
    
    // State stores case name
    const [caseName, setCaseName] = useState(props.caseName);
    // State stores case citation (note that this is an array)
    const [citationArr, setCitationArr] = useState(props.citation)

    // Handler for changing case name
    const handleNameChange = (event) => {
        setCaseName(event.target.value);
    }

    // Handler for save button
    const handleSave = () => {
        const data = {
            name: caseName,
            citation: citationArr
        };

        // Send a POST request to the server with the relevant data
        axios.post(apiRoot + `/editCaseIdentifiers/${props.caseId}`, { data })
        .then(res => {
            // Add UI function that informs user entry is updated/saved
            console.log(res.status);
        })
    }
    console.log(citationArr);

    // Build edit citation 
    let citeEdit = [];
    for (let i = 0; i < citationArr.length; i++) {
        // Handler for changing citation
        const handleCitationChange = (event) => {
            setCitationArr((() => {
                let newCitationArr = citationArr.concat();
                newCitationArr[i] = event.target.value;
                return newCitationArr;
            })());
        }
        citeEdit.push(<input 
            type="text"
            value={citationArr[i]}
            onChange={handleCitationChange}
            className={caseEditStyle.citation}
        />);

        // Handler for delete button
        const handleDeleteCite = () => {
            setCitationArr((() => {
                let newCitationArr = citationArr.concat();
                newCitationArr.splice(i, 1);
                return newCitationArr;
            })());
        }

        citeEdit.push(<Button
            className={caseEditStyle.deleteCitation}
            variant="light" 
            onClick={handleDeleteCite}
        >X</Button>)
    }

    // Handle add citation
    const handleAddCitation = () => {
        setCitationArr(citationArr.concat(""));
    }

    return(
        <Jumbotron style={jumboStyle}>
            <h3><input type="text" 
            value={caseName} 
            onChange={handleNameChange}
            className={caseEditStyle.caseName}
            /></h3>
            <p>
                {citeEdit}
                <Button variant="light" onClick={handleAddCitation} >Add</Button>
            </p>
            <Button variant="light" style={buttonStyle} onClick={handleSave} >Save</Button>
        </Jumbotron>
    );
}

export default TitleEditor