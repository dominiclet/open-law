import { useRouter } from 'next/router'
import axios from 'axios';
import { apiRoot } from '../../../config'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import categoriesStyle from '../../../styles/Categories.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Table from 'react-bootstrap/Table'
import FactsPopover from '../../../components/categories/FactsPopover'

const categoryPage = () => {
    const router = useRouter();
    const {tag} = router.query;

    // Convert iso date string to date representation
    const convertDate = (date) => {
        date = new Date(date)
        return `Last edited on ${date.toLocaleDateString("en-SG")} at ${date.toLocaleTimeString("en-SG")}`
    }


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
                <div className={categoriesStyle.body}>
                    {cases.map(entry => {
                        return (
                            <div className={categoriesStyle.caseContainer}>
                                <Link href={`/case/${entry._id}`}>
                                    <a className={categoriesStyle.caseName}>
                                        {entry.name}
                                    </a>
                                </Link>
                                <div className={categoriesStyle.citations}>
                                    {entry.citation.join("; ")}
                                </div>
                                <div className={categoriesStyle.timeStamp}>
                                    {convertDate(entry.lastEdit)}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Link href='/categories'>Go Back</Link>
            </>
        );
    }
}

export default categoryPage
