import { useRouter } from 'next/router'
import axios from 'axios';
import { apiRoot } from '../../../config'
import { useEffect, useState } from 'react';
import Link from 'next/link'
import caseStyle from '../../../styles/Case.module.css'
import OuterCase from '../../../components/casesummary/OuterCase'
import RelatedCases from '../../../components/casesummary/RelatedCases'
import withAuth from '../../../helpers/withAuth';
import Forum from '../../../components/casesummary/Forum'
import 'bootstrap/dist/css/bootstrap.min.css'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

const caseDisplayPage = () => {
    const router = useRouter();

    // State to store case data
    const [caseData, setCaseData] = useState();
    // State to check if data has loaded
    const [dataLoaded, setdataLoaded] = useState(false);

    // Get case data
    useEffect(() => {
        if (router.isReady) {
            const { id } = router.query;
            axios.get(apiRoot + `/cases/${id}`)
                .then(res => {
                    setCaseData(res.data);
                    setdataLoaded(true);
                })
                .catch(error => console.log(error));
        } else return;
    }, [router.isReady]);

    if (!dataLoaded) {
        return (<span>Loading...</span>)
    } else {
        return (
            <>
                <Tabs defaultActiveKey="case" id="test">
                    <Tab eventKey="case" title="Case Summary">
                        <div>
                            <OuterCase entry={caseData} />
                        </div>
                        <Link href={`/case/${caseData._id}/edit`} >
                            <a className={caseStyle.body}>Edit this case</a>
                        </Link>
                        <Link href='/'>
                            <a className={caseStyle.body}>Go Back</a>
                        </Link>
                    </Tab>
                    <Tab eventKey="relatedCases" title="Related Cases">
                        <RelatedCases entry={caseData}/>
                    </Tab>
                </Tabs>
            </>
        );
    }
}

export default caseDisplayPage

/* Removed for now
                    <Tab eventKey="forum" title="Forum">
                        <Forum posts = {caseData.posts}/>
                    </Tab>
*/