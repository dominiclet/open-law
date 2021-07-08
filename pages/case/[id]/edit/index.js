import { useRouter } from 'next/router';
import TitleEditor from '../../../../components/casesummary/edit/TitleEditor';
import caseEditStyle from '../../../../styles/CaseEdit.module.css';
import axios from 'axios';
import { apiRoot } from '../../../../config';
import { useEffect, useState } from 'react';
import EditorBuilder from '../../../../components/casesummary/edit/EditorBuilder';

const caseEditPage = () => {
    const router = useRouter();

    // Set max number of recent edits to show
    const MAX_RECENT_EDITS = 5;
    // State to store case data
    const [caseData, setCaseData] = useState();
    // State to check if data has loaded
    const [dataLoaded, setdataLoaded] = useState(false);

    // Get case data
    useEffect( () => {
        if (router.isReady) {
            const {id} = router.query;
            axios.get(apiRoot + `/cases/${id}`)
                .then(res => {
                    setCaseData(res.data);
                    setdataLoaded(true);

                    // Remember visit to this case edit for RecentEditCard
                    let recentEdits = localStorage.getItem("recentEdits");
                    const recentEditInfo = {
                        "caseName": res.data.name,
                        "caseId": id
                    }
                    if (recentEdits) {
                        let recents = JSON.parse(recentEdits);
                        if (!recents.some(elem => elem.caseId == id)) {
                            recents.push(recentEditInfo);
                            if (recents.length > MAX_RECENT_EDITS) {
                                recents.splice(0, 1);
                            }
                            localStorage.setItem("recentEdits", JSON.stringify(recents));
                        }
                    } else {
                        localStorage.setItem("recentEdits", JSON.stringify([recentEditInfo]));
                    }
                }).catch(error => {
                    if (error.response.status == 404) {
                        alert("Case is either deleted or does not exist. Redirecting back to home...");
                        let recentEdits = JSON.parse(localStorage.getItem("recentEdits"));
                        for (let i = 0; i < recentEdits.length; i++) {
                            if (recentEdits[i].caseId === id) {
                                recentEdits.splice(i, 1);
                                break;
                            }
                        }
                        localStorage.setItem("recentEdits", JSON.stringify(recentEdits));
                        router.push("/");
                    } else {
                        throw error;
                    }
                });
        } else return;
    }, [router.isReady]);

    if (!dataLoaded) {
        // If data is not loaded yet, display "loading"
        return (<span>Loading...</span>);
    } else {
        const date = new Date(caseData.lastEdit);

        return(
        <div className={caseEditStyle.editor}>
            {(() => {
                if (caseData.lastEdit == "") {
                    return (
                        <p className={caseEditStyle.editTimeStamp}>
                            This case was added by {caseData.lastEditBy}
                        </p>
                    );
                } else {
                    return (
                        <p className={caseEditStyle.editTimeStamp}>
                            Last edited by {caseData.lastEditBy} at {date.toLocaleTimeString("en-SG")} on {date.toLocaleDateString("en-SG")}
                        </p>
                    );
                }
            })()}
            <TitleEditor 
                caseId={caseData._id} 
                caseName={caseData.name} 
                citation={caseData.citation} 
            />
            <EditorBuilder 
                caseId={caseData._id} 
                facts={caseData.facts}
                issues={caseData.issues}
                holding={caseData.holding} 
            />
        </div>
        );
    }
}
 export default caseEditPage