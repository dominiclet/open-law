import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PersonCircle } from 'react-bootstrap-icons';
import { apiRoot } from '../../../config';
import styles from '../../../styles/Profile.module.css';

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

	return (
		<div className={styles.outerContainer}>
			<div className={styles.profileIcon}>
				<PersonCircle size="200" />
			</div>
			<div className={styles.rowContainer}>
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
				<div className={styles.userStatsContainer}>
					This user has 0 edits!
				</div>
			</div>
		</div>
	);
}

export default profilePage