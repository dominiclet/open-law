import { useState } from 'react';
import React from 'react';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import Dropdown from 'react-bootstrap/Dropdown';

const TagEditor = (props) => {


    // State to store search term entered in input text box
    const [searchTag, setSearchTag] = useState("");
    var allTags = ["Tort", "Contract", "Equity", "Evidence"];

    return (
        <div className={caseEditStyle.dropdown}>
            <input 
                className={caseEditStyle.tagger} 
                type="text" 
                placeholder="Tags" 
                value={searchTag}
                onChange={(event) => {setSearchTag(event.target.value)}} 
                onClick={(event) => {
                    event.target.nextSibling.style.display = "block";
                    event.stopPropagation();
                    document.addEventListener('click', () => {
                        console.log("REMOVE");
                        event.target.nextSibling.style.display = "none";
                    }, {once: true})
                }}
            />
            <div className={caseEditStyle.dropdownContent}>
                {allTags.filter((tag) => 
                    tag.toLowerCase().startsWith(searchTag.toLowerCase())
                ).map((tag) => <a>{tag}</a>)}
            </div>
        </div>
    );
}

export default TagEditor