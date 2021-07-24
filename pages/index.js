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

  // Build recent edits component
  let recentEditsBuilder = [];
  const recentEdits = JSON.parse(localStorage.getItem("recentEdits"));
  if (!recentEdits) {
    recentEditsBuilder.push("No recently edited cases.");
  } else {
    recentEdits.forEach(elem => {
      recentEditsBuilder.push(
        <RecentEditCard 
          caseName={elem.caseName} 
          caseId={elem.caseId} 
          caseCitation={elem.caseCitation}
        />
      );
    });
  }
  
  // Recent activity component
  let recentActivityBuilder = [];

  if (!dataLoaded) {
    recentActivityBuilder.push(<Spinner animation="border" className={homeStyle.loadingSpinner} />);
  } else {
    // Build recent activity
    pageData.map((activity) => {
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
    recentActivityBuilder.reverse();
  }

  return (
    <div className={homeStyle.container1}>
      <Head>
          <title>[Placeholder]</title>
      </Head>
      <div className={homeStyle.recentEditsOuterContainer}>
        <h5>Recent edits</h5>
        <div className={homeStyle.recentEditsInnerContainer}>
          {recentEditsBuilder}
        </div>
      </div>
      <LargeCaseSearch />
      <div className={homeStyle.activityOuterContainer}>
        <h5>Recent activity</h5>
        {recentActivityBuilder}
      </div>
    </div>
  )
}

export default Home;