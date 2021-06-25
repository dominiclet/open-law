<<<<<<< HEAD
import Head from 'next/head'
import EntryList from '../components/homepage/EntryList'
import Header from '../components/Header'
import Banner from '../components/homepage/Banner'

// Props: entries (all case entries)
export default function Home(props) {
=======
import Head from 'next/head';
import EntryList from '../components/EntryList';
import ActivityCard from '../components/home/ActivityCard';
import RecentEditCard from '../components/home/RecentEditCard';
import homeStyle from '../styles/Home.module.css';
import { apiRoot } from '../config';
import axios from 'axios';

export default function Home(props) {
  
  // Build recent activity
  let recentActivityBuilder = [];
  props.data.map((activity) => {
    recentActivityBuilder.push(<ActivityCard 
      caseId={activity.id}
      caseName={activity.case_name}
      action={activity.action}
      subtopic={activity.subtopic}
      time={activity.time}
    />);
  })

>>>>>>> dom
  return (
    <div className={homeStyle.container1}>
      <Head>
        <title>David</title>
      </Head>
<<<<<<< HEAD
      <Banner/>
      <EntryList entries = {props.entries} />
=======
      <h4>Your recent edits</h4>
      <RecentEditCard />
      <br/>
      <h4>Recent activity</h4>
      {recentActivityBuilder}
>>>>>>> dom
    </div>
  )
}

<<<<<<< HEAD
// fetching data
const defaultEndPoint = `http://localhost:5000/cases`;
export const getServerSideProps = async() => {
  const res = await fetch (defaultEndPoint)
  const entries = await res.json()
=======
export async function getStaticProps() {
  const res = await axios.get(apiRoot + '/recentActivity');
  const data = res.data;
>>>>>>> dom
  return {
    props: { data }
  }
}