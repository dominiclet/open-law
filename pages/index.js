import Head from 'next/head';
import EntryList from '../components/EntryList';
import ActivityCard from '../components/home/ActivityCard';
import RecentEditCard from '../components/home/RecentEditCard';
import homeStyle from '../styles/Home.module.css';

export default function Home({entries}) {
  return (
    <div className={homeStyle.container1}>
      <Head>
        <title>David</title>
      </Head>
      <h4>Your recent edits</h4>
      <RecentEditCard />
      <br/>
      <h4>Recent activity</h4>
      <ActivityCard />
      <ActivityCard />
    </div>
  )
}

