import { useRouter } from 'next/router';
import Link from 'next/link';
import OuterCase from '../../../components/casesummary/OuterCase';
import axios from 'axios';

const entry = () => {
    const router = useRouter();
    const {id} = router.query;
    // Fetch case here, then pass as props to OuterCase
    // TODO: needs Ivan's endpoint

    return (
        <div>
            <OuterCase info={id}/>
            <Link href={`/case/${id}/edit`}>
                <a>Edit this case</a>
            </Link>
        </div>
    )
}

export default entry
