import { useRouter } from 'next/router'
import axios from 'axios';
import { apiRoot } from '../../../config'
import { useEffect, useState } from 'react';
import Link from 'next/link'
import caseStyle from '../../../styles/Case.module.css'
import OuterCase from '../../../components/casesummary/OuterCase'
import RelatedCases from '../../../components/casesummary/RelatedCases'
import 'bootstrap/dist/css/bootstrap.min.css'

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
                <div className={caseStyle.side}>
                    <OuterCase entry={caseData} />
                    <RelatedCases />
                </div>
                <Link
                    href={`/case/${caseData._id}/edit`}
                    className="d-flex justify-content-center"
                >
                    <a>Edit this case</a>
                </Link>
                <br />
                <Link href='/'>Go Back</Link>
            </>
        );
    }
}

export default caseDisplayPage
