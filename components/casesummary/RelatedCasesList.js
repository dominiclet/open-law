import relatedCasesStyle from '../../styles/RelatedCases.module.css'
import { useState } from 'react'
import Link from 'next/link'

const RelatedCasesList = (props) => {

    // Convert iso date string to date representation
    const convertDate = (date) => {
        date = new Date(date)
        return `Last edited on ${date.toLocaleDateString("en-SG")} at ${date.toLocaleTimeString("en-SG")}`
    }
    
    // For search bar 
    const [name, setName] = useState("");
    const [matchedCases, setMatchedCases] = useState(props.cases);
    const filter = (c) => {
        const keyword = c.target.value;

        if (!keyword) {
            setMatchedCases(props.cases);
        } else {
            const res = props.cases.filter((caseName) => {
                return caseName.name.toLowerCase().startsWith(keyword.toLowerCase());
            });
            setMatchedCases(res);
        }
        setName(keyword);
    };
    
    return (
        <>
            <div className = {relatedCasesStyle.searchContainer}> 
                <input
                    type = "search"
                    value = {name}
                    onChange = {filter}
                    className = {relatedCasesStyle.searchBar}
                    placeholder = "Filter"
                />
            </div>
            <div className={relatedCasesStyle.body}>
                {matchedCases && matchedCases.length > 0 ? (
                    matchedCases.map(entry => {
                        return (
                            <div key = {entry.name} className={relatedCasesStyle.caseContainer}>
                                <Link href={`${entry._id}`} onClick={()=>{window.location.reload()}}>
                                    <a className={relatedCasesStyle.caseName} >
                                        {entry.name}
                                    </a>
                                </Link>
                                <div className={relatedCasesStyle.citations}>
                                    {entry.citation.join("; ")}
                                </div>
                                <div className={relatedCasesStyle.timeStamp}>
                                    {convertDate(entry.lastEdit)}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <h4 className = {relatedCasesStyle.text}>No results found</h4>
                )}
            </div>
        </>
    )
}

export default RelatedCasesList