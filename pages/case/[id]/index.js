import {useRouter} from 'next/router'
import Link from 'next/link'
import caseStyle from '../../../styles/Case.module.css'
import OuterCase from '../../../components/casesummary/OuterCase'
import RelatedCases from '../../../components/casesummary/RelatedCases'
import 'bootstrap/dist/css/bootstrap.min.css'

const entry = (props) => {
    return (
        <>
            <div className={caseStyle.side}>
                <OuterCase entry = {props.entry} />
                <RelatedCases/>
            </div>
            <Link 
                href={`/case/${props.entry._id}/edit`}
                className="d-flex justify-content-center"
            >
                <a>Edit this case</a>
            </Link>
            <br/>
            <Link href='/'>Go Back</Link>
        </>
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
