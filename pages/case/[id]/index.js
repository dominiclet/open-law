import { useRouter } from 'next/router';
import Link from 'next/link';
import OuterCase from '../../../components/casesummary/OuterCase';

const entry = () => {
    const router = useRouter();
    const {id} = router.query;
    // Fetch case here, then pass as props to OuterCase

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
