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
export const getStaticProps = async() =>{
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=6`)
  const entries = await res.json()

  return {
    props: {
      entries
    }
  }
}
