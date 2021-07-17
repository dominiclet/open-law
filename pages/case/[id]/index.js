import { useRouter } from 'next/router';
import axios from 'axios';
import { apiRoot } from '../../../config';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import caseStyle from '../../../styles/Case.module.css';
import OuterCase from '../../../components/casesummary/OuterCase';
import RelatedCases from '../../../components/casesummary/RelatedCases';
import Forum from '../../../components/casesummary/Forum';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

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
            <div className={caseStyle.overallContainer}>
                <Tab.Container defaultActiveKey="case">
                    <Nav className={caseStyle.navContainer} variant="pills">
                        <Nav.Item>
                            <Nav.Link eventKey="case">
                                Case summary
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="forum">
                                Forum
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="relatedCases">
                                Related cases
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content className={caseStyle.contentContainer}>
                        <Tab.Pane eventKey="case">
                            <OuterCase entry={caseData} />
                            <Link href={`/case/${caseData._id}/edit`} >
                                <a className={caseStyle.body}>Edit this case</a>
                            </Link>
                            <Link href='/'>
                                <a className={caseStyle.body}>Go Back</a>
                            </Link>
                        </Tab.Pane>
                        <Tab.Pane eventKey="forum">
                            <Forum posts = {caseData.posts}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="relatedCases">
                            <RelatedCases entry={caseData}/>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
                <div className={caseStyle.navContainer}>
                    {/* Dummy div for now, used to center the contents.
                    Can use to include new features on the right in the future.*/}
                </div>
            </div>
        );
    }
}

export default caseDisplayPage
