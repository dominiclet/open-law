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
    // props.link: Link to case

    const router = useRouter();

    // State stores case name
    const [caseName, setCaseName] = useState(props.caseName);
    // State stores case citation (note that this is an array)
    const [citationArr, setCitationArr] = useState(props.citation);
    // State stores link to case
    const [caseLink, setCaseLink] = useState(props.link ? props.link : '');

    // Handler for changing case name
    const handleNameChange = (event) => {
        setCaseName(event.target.value);
        document.getElementById("titleUpload").style.color = "red";
    }

    // Handler for save button
    const handleSave = () => {
        const data = {
            name: caseName,
            citation: citationArr,
            link: caseLink,
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
                if (res.status == 200) {
                    // Remove red glow
                    document.getElementById("titleUpload").style.color = "black";
                }
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
            document.getElementById("titleUpload").style.color = "red";
        }
        citeEdit.push(
            <input 
                type="text"
                value={citationArr[i]}
                onChange={handleCitationChange}
                className={caseEditStyle.citation}
                placeholder="Citation"
                key={"citationEditor" + i}
            />
        );

        // Handler for delete button
        const handleDeleteCite = () => {
            setCitationArr((() => {
                let newCitationArr = citationArr.concat();
                newCitationArr.splice(i, 1);
                return newCitationArr;
            })());
            document.getElementById("titleUpload").style.color = "red";
        }

        citeEdit.push(<Trash
            className={caseEditStyle.deleteCitation}
            onClick={handleDeleteCite}
            key={"trash" + i}
        />)
    }

    // Handle add citation
    const handleAddCitation = () => {
        setCitationArr(citationArr.concat(""));
        document.getElementById("titleUpload").style.color = "red";
    }

    // Handle change of case link
    const handleChangeLink = (event) => {
        setCaseLink(event.target.value);
        document.getElementById("titleUpload").style.color = "red";
    }

    return(
        <Jumbotron className={caseEditStyle.titleContainer}>
            <input 
                id="title"
                type="text" 
                value={caseName} 
                onChange={handleNameChange}
                className={caseEditStyle.caseName}
                placeholder="Case name"
            />
            <p className={caseEditStyle.citationContainer}>
                {citeEdit}
                <Plus className={caseEditStyle.addButton} 
                    size="30" onClick={handleAddCitation} 
                />
            </p>
            <input 
                type="text"
                className={caseEditStyle.caseLink}
                placeholder="Link to case"
                value={caseLink}
                onChange={handleChangeLink}
            />
            <Upload 
                id="titleUpload"
                className={caseEditStyle.saveButton} 
                size="30" 
                onClick={handleSave} 
            />
        </Jumbotron>
    );
}

export default TitleEditor