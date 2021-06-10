import { useRouter } from 'next/router';
import FactEditor from '../../../../components/casesummary/edit/FactEditor';
import HoldingEditor from '../../../../components/casesummary/edit/HoldingEditor';
import TitleEditor from '../../../../components/casesummary/edit/TitleEditor';
import AddTopicButton from '../../../../components/casesummary/edit/EditorBuilder';
import caseEditStyle from '../../../../styles/CaseEdit.module.css';
import axios from 'axios';
import { apiRoot } from '../../../../config';
import { useEffect, useState } from 'react';
import EditorBuilder from '../../../../components/casesummary/edit/EditorBuilder';
import Button from 'react-bootstrap/Button';

const caseEditPage = () => {
    const router = useRouter();

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
            })
            .catch(error => console.log(error));
        } else return;
    }, [router.isReady]);

    // Reduce padding for Jumbotron
    const jumboStyle = {
        "padding": "1rem 2rem",
        "width": "60vw",
        "margin": "auto",
        "minWidth": "1000px"
    };
    
    if (!dataLoaded) {
        // If data is not loaded yet, display "loading"
        return (<span>Loading...</span>);
    } else {

        return(
        <div>
            <TitleEditor 
            caseId={caseData._id} 
            caseName={caseData.name} 
            citation={caseData.citation} 
            />
            <EditorBuilder caseId={caseData._id} facts={caseData.facts}
            holding={caseData.holding} />
        </div>
        );
    }
}
 export default caseEditPage