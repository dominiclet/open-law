import Jumbotron from 'react-bootstrap/Jumbotron';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import { useState } from 'react';
import { apiRoot } from '../../../config';
import axios from 'axios';
import { Trash, Upload, Plus } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';

const TitleEditor = (props) => {
    // props.caseId: Unique ID of case
    // props.caseName: String of the case name
    // props.citation: Array of citations

    const router = useRouter();

    // Jumotron styling (Reduce padding for Jumbotron)
    const jumboStyle = {
        "padding": "1rem 2rem",
        "width": "100%",
        "margin": "auto",
        "height": "175px",
        "maxWidth": "1000px"
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
            citation: citationArr,
            time: new Date().toJSON()
        };

        // Retrieve token from storage
        const token = localStorage.getItem("jwt-token");
        
        if (!token) {
            router.push("/login");
        } else {
            // Send a POST request to the server with the relevant data
            axios.post(apiRoot + `/editCaseIdentifiers/${props.caseId}`, { data }, {
                headers: {'Authorization': 'Bearer ' + token}
            }).then(res => {
                // Add UI function that informs user entry is updated/saved
                console.log("Add UI that informs user entry is uploaded");
            }).catch(err => {
                console.log("Access denied");
                router.push("/login");
            });
        }
    }

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

        citeEdit.push(<Trash
            className={caseEditStyle.deleteCitation}
            onClick={handleDeleteCite}
        />)
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
                <Plus className={caseEditStyle.addButton} 
                    size="30" onClick={handleAddCitation} 
                />
            </p>
            <Upload className={caseEditStyle.saveButton} size="30" onClick={handleSave} />
        </Jumbotron>
    );
}

export default TitleEditor