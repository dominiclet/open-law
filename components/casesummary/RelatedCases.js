import ListGroup from 'react-bootstrap/ListGroup'
import caseStyle from '../../styles/Case.module.css'
import { useRouter } from 'next/router'
import axios from 'axios';
import { useEffect, useState } from 'react';
import {apiRoot} from '../../config'

const RelatedCases = () => {
    const router = useRouter();

    // State to store list of related cases
    const [cases, setCaseData] = useState();
    // State to check if data has loaded
    const [dataLoaded, setdataLoaded] = useState(false);

    // Get case data
    useEffect(() => {
        if (router.isReady) {
            const { id } = router.query;
            axios.get(apiRoot + `/relatedCases/${id}`)
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
            <div>
                <h1 className={caseStyle.relatedCases}>Related Cases</h1>
                <ListGroup>
                    {cases.map( (entry) => (
                        <ListGroup.Item className={caseStyle.relatedCases} action href={`/case/${entry._id}`}>
                            {entry.name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        )
    }
}

export default RelatedCases
