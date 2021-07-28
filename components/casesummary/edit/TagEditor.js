import { useState } from 'react';
import React from 'react';
import caseEditStyle from '../../../styles/CaseEdit.module.css';
import Badge from 'react-bootstrap/Badge';
import { Trash } from 'react-bootstrap-icons';
import { allTags } from '../../../config';

const TagEditor = (props) => {
    // props.tags: Array of tags
    // props.updateTags: Callback function to update parent state of tags

    // State to store search term entered in input text box
    const [searchTag, setSearchTag] = useState("");

    const tagBuilder = () => {
        if (props.tags.length == 0) {
            return "No tags added";
        } else {
            return props.tags.map((tag) => (
                <div className={caseEditStyle.indivTagContainer}>
                    <Badge pill variant="dark">{tag}</Badge>
                    <Trash 
                        className={caseEditStyle.deleteTag}
                        onClick={() => {
                            let newSelectedTags = props.tags.concat();
                            newSelectedTags.splice(props.tags.indexOf(tag), 1);
                            props.updateTags(newSelectedTags);
                        }}
                    />
                </div>
            ));
        }
    }

    return (
        <div className={caseEditStyle.dropdown}>
            <div className={caseEditStyle.outerTagContainer}>
                {tagBuilder()}
            </div>
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
                        event.target.nextSibling.style.display = "none";
                    }, {once: true})
                }}
            />
            <div className={caseEditStyle.dropdownContent}>
                {allTags.filter((tag) => 
                    tag.toLowerCase().startsWith(searchTag.toLowerCase())
                ).map((tag) => <a onClick={() => {
                    if (!props.tags.includes(tag)) {
                        let newSelectedTags = props.tags.concat();
                        newSelectedTags.push(tag);
                        props.updateTags(newSelectedTags);
                    }
                }}>{tag}</a>)}
            </div>
        </div>
    );
}

export default TagEditor