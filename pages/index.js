import Head from 'next/head';
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

  return (
    <div className={homeStyle.container1}>
      <Head>
        <title>David</title>
      </Head>
      <h4>Your recent edits</h4>
      <RecentEditCard />
      <br/>
      <h4>Recent activity</h4>
      {recentActivityBuilder}
    </div>
  )
}

export async function getStaticProps() {
  const res = await axios.get(apiRoot + '/recentActivity');
  const data = res.data;
  return {
    props: { data }
  }
}