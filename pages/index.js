import Head from 'next/head';
import ActivityCard from '../components/home/ActivityCard';
import RecentEditCard from '../components/home/RecentEditCard';
import homeStyle from '../styles/Home.module.css';
import { apiRoot } from '../config';
import axios from 'axios';
import withAuth  from '../helpers/withAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Home = (props) => {
  const router = useRouter();

  // State to store page data
  const [pageData, setPageData] = useState();
  // State to check if data has loaded
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch page data
  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    if (!token) {
      console.error("No login token!");
      router.push("/login");
    } else {
      axios.get(apiRoot + "/recentActivity", {
        headers: {'Authorization': 'Bearer ' + token}
      }).then(res => {
          setPageData(res.data);
          setDataLoaded(true);
        }).catch(err => console.log(err));
    }
  }, []);
  
  // Recent activity component
  let recentActivityBuilder = [];

  if (!dataLoaded) {
    recentActivityBuilder.push(<div>Loading...</div>);
  } else {
    // Build recent activity
    pageData.map((activity) => {
      recentActivityBuilder.push(<ActivityCard 
        caseId={activity.id}
        caseName={activity.case_name}
        action={activity.action}
        subtopic={activity.subtopic}
        time={activity.time}
      />);
    })
    recentActivityBuilder.reverse();
  }

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

export default Home;