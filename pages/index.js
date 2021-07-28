import Head from 'next/head';
import ActivityCard from '../components/home/ActivityCard';
import RecentEditCard from '../components/home/RecentEditCard';
import homeStyle from '../styles/Home.module.css';
import { apiRoot } from '../config';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LargeCaseSearch from '../components/search/LargeCaseSearch';
import { Spinner } from 'react-bootstrap';

const Home = (props) => {
  const router = useRouter();

  // State to store activity data
  const [activityData, setActivityData] = useState();
  // State to check if activity data has loaded
  const [activityDataLoaded, setActivityDataLoaded] = useState(false);

  //  State to store recent edits data 
  const [recentEditsData, setRecentEditsData] = useState();
  // State to check if recent edits data has loaded
  const [recentEditsDataLoaded, setRecentEditsDataLoaded] = useState(false);

  // Fetch page data
  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    if (!token) {
      console.error("No login token!");
      router.push("/login");
    } else {
      // Fetch recent activity 
      axios.get(apiRoot + "/recentActivity", {
        headers: {'Authorization': 'Bearer ' + token}
      }).then(res => {
          setActivityData(res.data);
          setActivityDataLoaded(true);
      }).catch(err => console.log(err));

      // Fetch recent edits
      axios.get(apiRoot + "/recentEdits", {
        headers: {'Authorization': 'Bearer ' + token}
      }).then(res => {
        setRecentEditsData(res.data);
        setRecentEditsDataLoaded(true);
      }).catch(err => console.error(err));
    }
  }, []);

  // Build recent edits component
  let recentEditsBuilder = [];
  if (!recentEditsDataLoaded) {
    recentEditsBuilder.push(<Spinner animation="border" className={homeStyle.loadingSpinner} />);
  } else {
    recentEditsData.forEach(elem => {
      recentEditsBuilder.push(
        <RecentEditCard 
          caseName={elem.caseName} 
          caseId={elem.caseId} 
          caseCitation={elem.caseCitation}
          toEdit={true}
        />
      );
    });
  }
  
  // Recent activity component
  let recentActivityBuilder = [];

  if (!activityDataLoaded) {
    recentActivityBuilder.push(<Spinner animation="border" className={homeStyle.loadingSpinner} />);
  } else {
    // Build recent activity
    activityData.map((activity) => {
      recentActivityBuilder.push(<ActivityCard 
        caseId={activity.id}
        name={activity.name}
        caseName={activity.case_name}
        action={activity.action}
        subtopic={activity.subtopic}
        time={activity.time}
        prevName={activity.prevName}
        prevCitation={activity.prevCitation}
        currCitation={activity.currCitation}
      />);
    })
  }

  return (
    <div className={homeStyle.container1}>
      <Head>
          <title>[Placeholder]</title>
      </Head>
      <div className={homeStyle.recentEditsOuterContainer}>
        <h5 style={{"textAlign": "center"}}>Recent edits</h5>
        <div className={homeStyle.recentEditsInnerContainer}>
          {recentEditsBuilder}
        </div>
      </div>
      <LargeCaseSearch />
      <div className={homeStyle.activityOuterContainer}>
        <h5 style={{"textAlign": "center"}}>Recent activity</h5>
        {recentActivityBuilder}
      </div>
    </div>
  )
}

export default Home;