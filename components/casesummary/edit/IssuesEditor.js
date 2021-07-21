import axios from "axios";
import { useState } from "react";
import { Plus, Trash, Upload } from "react-bootstrap-icons";
import { apiRoot } from "../../../config";
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import { useRouter } from 'next/router';


const IssuesEditor = (props) => {
    // props.caseId: Unique case ID
    // props.data: Array of issues
    // props.setData: Callback function to change the parent state of issues

    const router = useRouter();
    // Handle value of input internally
    const [issuesData, setIssuesData] = useState(props.data);

    let issuesBuilder = [];
    for (const idx in issuesData) {
        // Handle editing of inputs
        const handleInput = (event) => {
            setIssuesData((() => {
                let newIssuesData = issuesData.concat();
                newIssuesData[idx] = event.target.value;
                return newIssuesData;
            })())
            // Paint submit button red
            document.getElementById("issueUpload").style.color = "red";
        }
        // Handle deletion of issue
        const handleDelete = () => {
            setIssuesData((() => {
                let newIssuesData = issuesData.concat();
                newIssuesData.splice(idx, 1);
                return newIssuesData;
            })());
            // Paint submit button red
            document.getElementById("issueUpload").style.color = "red";
        }

        issuesBuilder.push(
            <li key={idx.toString()} >
                <div className={caseEditStyle.listContainer} id="issueLiContainer">
                    <input 
                        id={"issue" + idx}
                        key={"input" + idx}
                        type="text"
                        className={caseEditStyle.issuesInput}
                        value={issuesData[idx]} 
                        onChange={handleInput}
                        placeholder="Enter issue here"
                    />
                    <Trash
                        key={"deleteIssue" + idx}
                        size="25"
                        className={caseEditStyle.deleteIssue}
                        onClick={handleDelete}
                    />
                </div>
            </li>
        )
    }

    // Handle add issue
    const handleAddIssue = () => {
        setIssuesData((() => {
            let newIssuesData = issuesData.concat();
            newIssuesData.push("");
            return newIssuesData;
        })())
        // Paint submit button red
        document.getElementById("issueUpload").style.color = "red";
    }

    // Handle upload issues
    const handleUpload = () => {
        const payload = {
            issuesData: issuesData,
            time: new Date().toJSON()
        };

        const accessToken = localStorage.getItem("jwt-token");

        axios.post(apiRoot + `/updateIssues/${props.caseId}`,
            payload, {
                headers: {'Authorization': 'Bearer ' + accessToken}
            }).then(res => {
                if (res.status == 200) {
                    props.setData(res.data);
                    // Paint submit button black
                    document.getElementById("issueUpload").style.color = "black";
                }
            }).catch(e => {
                console.error(e);
                if (e.response.status == 401) {
                    if (accessToken) {
                        localStorage.removeItem("jwt-token");
                    }
                    router.push("/login");
                } else {
                    throw e;
                }
            });
    }

    return (
        <div className={caseEditStyle.issuesContainer}>
            <ol>
                {issuesBuilder}
            </ol>
            <Plus
                size="40"
                className={caseEditStyle.addTopicButton}
                onClick={handleAddIssue}
            />
            <Upload 
                size="30" 
                id="issueUpload"
                className={caseEditStyle.editorSubmitButton} 
                onClick={handleUpload}
            />
        </div>
    );
}

export default IssuesEditor