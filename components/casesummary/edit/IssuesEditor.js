import { useState } from "react";


const IssuesEditor = (props) => {
    // props.data: Array of issues
    // props.setData: Callback function to change the parent state of issues

    // Handle value of input internally
    const [issuesData, setIssuesData] = useState(props.data);
    console.log(issuesData)

    let issuesBuilder = [];
    for (const idx in issuesData) {
        issuesBuilder.push(
            <li>
                <input 
                    type="text"
                    value={issuesData[idx]} 
                />
            </li>
        )
    }

    return (
        <ol>
            {issuesBuilder}
        </ol>
    );
}

export default IssuesEditor