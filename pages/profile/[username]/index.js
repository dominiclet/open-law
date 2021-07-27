import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import { apiRoot } from '../../../config';
import styles from '../../../styles/Profile.module.css';
import RecentEditCard from '../../../components/home/RecentEditCard';

const profilePage = () => {
	const router = useRouter();

	// State to store user data
	const [userData, setUserData] = useState();
	// State to check if data has loaded
	const [dataLoaded, setDataLoaded] = useState();

	// Fetch user data
	useEffect(() => {
		if (router.isReady) {
			const { username } = router.query;
			axios.get(apiRoot + `/user/${username}`, {
				headers: {'Authorization': 'Bearer ' + localStorage.getItem("jwt-token")}
			}).then(res => {
					if (res.status == 200) {
						setUserData(res.data);
						setDataLoaded(true);
					}
				}).catch(err => console.error(err));
		}
	}, [router.isReady]);

	// Prep the recent edits component
	let recentEditsBuilder = [];
	if (dataLoaded) {
		userData["recent_edits"].forEach(elem => {
			recentEditsBuilder.push(
				<RecentEditCard
					caseName={elem.caseName}
					caseId={elem.caseId}
					caseCitation={elem.caseCitation}
					toEdit={false}
				/>
			);
		})
	}

	return (
		<div className={styles.outerContainer}>
			<div className={styles.profileIcon}>
				<PersonCircle size="200" />
			</div>
			<div className={styles.row1Container}>
				<div className={styles.userInfoContainer}>
					<div className={styles.labelContainer}>
						Username <br/>
						Name <br/>
						Class <br/>
					</div>
					<div className={styles.userDataContainer}>
						{dataLoaded ? userData.username : ""} <br />
						{dataLoaded ? userData.name : ""} <br />
						{dataLoaded ? userData.class : ""} <br/> 
					</div>
				</div>
				{dataLoaded ?
				<div className={styles.userStatsContainer}>
					<div>
						<h5>Cases created</h5>
						<div className={styles.statData}>
							{userData.stats.casesCreated}
						</div>
					</div>
					<div>
						<h5>Expert in</h5>
						<div className={styles.statData}>
							{(() => {
								let maxValue = 0;
								let mostContributed;
								const contributions = userData.stats.contributions;
								for (const key in contributions) {
									if (contributions[key] >= maxValue) {
										mostContributed = key;
									}
								}
								return mostContributed;
							})()}
						</div>
					</div>
				</div>
				: <Spinner animation="border" className={styles.spinner}/>}
			</div>
			{dataLoaded ?
			<div className={styles.row2Container}>
				<div className={styles.recentEdits}>
					<h5 className={styles.recentEditsHeader}>Recently edited cases</h5>
					<div className={styles.recentEditsContainer}>
						{recentEditsBuilder}
					</div>
				</div>
			</div>
			: null}
		</div>
	);
}

export default profilePage