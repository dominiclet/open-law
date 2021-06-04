import Head from 'next/head'
import EntryList from '../components/homepage/EntryList'
import Header from '../components/Header'

// Props: entries (all case entries)
export default function Home(props) {
  return (
    <div>
      <Head>
        <title>Lawmology</title>
      </Head>
      <EntryList entries = {props.entries} />
    </div>
  )
}

// fetching data
const defaultEndPoint = `http://localhost:5000/cases`;
export const getServerSideProps = async() => {
  const res = await fetch (defaultEndPoint)
  const entries = await res.json()
  return {
    props: {
      entries
    }
  }
}