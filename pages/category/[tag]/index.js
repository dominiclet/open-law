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
        return `${date.toLocaleTimeString("en-SG")} on ${date.toLocaleDateString("en-SG")}`
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
                <h1>{tag}</h1>
                <Table striped bordered className = {categoriesStyle.body}>
                    <thead>
                        <tr>
                            <th>Case</th>
                            <th>Citation</th>
                            <th>Last Edited</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.map( (entry) => (
                            <tr>
                                <td>
                                    <Link href={`/case/${entry._id}`}>
                                        {entry.name}
                                    </Link>
                                </td>
                                <td>{entry.citation}</td>
                                <td>{convertDate(entry.lastEdit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <br />
                <Link href='/categories'>Go Back</Link>
            </>
        );
    }
}

export default categoryPage
