import Head from 'next/head'
import EntryList from '../components/EntryList'

export default function Home({entries}) {
  return (
    <div>
      <Head>
        <title>Lawmology</title>
      </Head>

      <EntryList entries = {entries} />
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