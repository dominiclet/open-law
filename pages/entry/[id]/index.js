import {useRouter} from 'next/router'
import Link from 'next/link'
import caseStyle from '../../../styles/Case.module.css'
import TextBox from '../../../components/TextBox'
import Head from 'next/head'

const entry = ({entry}) => {

    return (
        <>
            <Head>
                <title>
                    Case {entry.id}
                </title>
            </Head>
            <div className={caseStyle.casesummary}>
                <header className={caseStyle.header}>
                    <h1>Case Name</h1>
                </header>
                <TextBox/>
                <TextBox/>
                <TextBox/>
            </div>
            <Link href='/'>Go Back</Link>
        </>
    )
}

export const getStaticProps = async (context) => {
    const res = await fetch (`https://jsonplaceholder.typicode.com/posts/${context.params.id}`)

    const entry = await res.json()
    return {
        props: {
            entry
        }
    }
}

export const getStaticPaths = async () => {
    const res = await fetch (`https://jsonplaceholder.typicode.com/posts`)

    const entries = await res.json()
    const ids = entries.map(entry => entry.id)
    const paths = ids.map(id => ({params: {id: id.toString()}}))

    return {
        paths, 
        fallback: false
    }
}

export default entry
