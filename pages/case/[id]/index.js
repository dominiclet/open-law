import {useRouter} from 'next/router';
import Link from 'next/link';
import OuterCase from '../../../components/casesummary/OuterCase';
import 'bootstrap/dist/css/bootstrap.min.css';

const entry = ({entry}) => {
    return (
        <div>
            <OuterCase entry = {entry} />
            <Link href={`/case/${id}/edit`}>
                <a>Edit this case</a>
            </Link>
            <Link href='/'>Go Back</Link>
        </div>
    )
}
export const getStaticPaths = async () => {
    const res = await fetch (`http://localhost:5000/cases`)
    const entries = await res.json()
    const paths = entries.map(entry => ({params: {id: entry._id.toString()}}))

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async ({params}) => {
    const res = await fetch (`http://localhost:5000/cases/${params.id}`)
    const entry = await res.json()
    return {
        props: {
            entry
        }
    }
}

export default entry
