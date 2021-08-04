import { useRouter } from 'next/router'
import axios from 'axios';
import { apiRoot } from '../../../config'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css'
import Filter from '../../../components/categories/Filter'
import FactsPopover from '../../../components/categories/FactsPopover'

const categoryPage = () => {
    const router = useRouter();
    const {tag} = router.query;

    // State to store cases
    const [cases, setCaseData] = useState();
    // State to check if data has loaded
    const [dataLoaded, setdataLoaded] = useState(false);

    // Get case data
    useEffect(() => {
        if (router.isReady) {
            axios.get(apiRoot + `/casesTag/${tag}/10`)
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
                <h4>{tag}</h4>
                <Filter cases = {cases}/>
                <Link href='/categories'>Go Back</Link>
            </>
        );
    }
}

export default categoryPage