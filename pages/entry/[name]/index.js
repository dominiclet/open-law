import {useRouter} from 'next/router';
import Link from 'next/link';
import OuterCase from '../../../components/casesummary/OuterCase';
import 'bootstrap/dist/css/bootstrap.min.css';

const entry = ({entry}) => {

    return (
        <div>
            <OuterCase entry = {entry} />
            <Link href='/'>Go Back</Link>
        </div>
    )
}

export const getStaticProps = async (context) => {
    const res = await fetch (`http://localhost:5000/cases/${context.params.name}`)
    const entry = await res.json()
    return {
        props: {
            entry
        }
    }
}

export const getStaticPaths = async (id) => {
    const res = await fetch (`http://localhost:5000/cases`)
    const entries = await res.json()
    const names = entries.map(entry => entry.name)
    const paths = names.map(name => ({params: {name: name.toString()}}))

    return {
        paths,
        fallback: false
    }
}

export default entry
