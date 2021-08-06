import relatedCasesStyle from '../../styles/RelatedCases.module.css'
import RelatedCasesList from './RelatedCasesList'
import { useRouter } from 'next/router'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { apiRoot } from '../../config'
import { Spinner } from 'react-bootstrap'
import Link from 'next/link'

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
        return (
            <Spinner animation="border" className={relatedCasesStyle.loadingSpinner}/>
        )
    } else {
        return ( 
            <>
                <h1 className={relatedCasesStyle.header}>Related Cases</h1>
                <RelatedCasesList className={relatedCasesStyle.card} cases = {cases}/>
            </> 
        )
    }
}

export default RelatedCases
