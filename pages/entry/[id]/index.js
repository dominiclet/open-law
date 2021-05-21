import {useRouter} from 'next/router';
import Link from 'next/link';
import OuterCase from '../../../components/casesummary/OuterCase';
import 'bootstrap/dist/css/bootstrap.min.css';

const entry = ({entry}) => {

    return (
        <div>
            <OuterCase />
            <Link href='/'>Go Back</Link>
        </div>
    )
}

export default entry
