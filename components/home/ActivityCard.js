import Card from 'react-bootstrap/Card';
import homeStyle from '../../styles/Home.module.css';
import Link from 'next/link'
import { ArrowRightShort } from 'react-bootstrap-icons';

const ActivityCard = (props) => {
	// props.caseId: unique case ID
	// props.caseName: The literal case name 
	// props.action: The activity that was undertaken (EDIT, DELETE, ADD)
	// props.subtopic: The affected subtopic (applicable if DELETE or EDIT)
	// props.time: The time of activity

	// Calculate how long ago was this activity
	const timeStamp = (() => {
		// Convert from milliseconds to seconds
		let timeDiff = Math.floor((new Date() - new Date(props.time))/1000);
		if (timeDiff < 60) {
			// Less than a minute
			return timeDiff + " seconds ago";
		} else if (timeDiff < 3600) {
			// Less than an hour
			let minute = Math.floor(timeDiff / 60);
			return minute == 1 ? minute + " minute ago" : minute + " minutes ago";
		} else if (timeDiff < 86400) {
			// Less than a day
			let hour = Math.floor(timeDiff / 3600);
			return hour == 1 ? hour + " hour ago" : hour + " hours ago";
		} else {
			// If more than a day, just return the number of days
			let day = Math.floor(timeDiff / 86400);
			return day == 1 ? day + " day ago" : day + " days ago";
		}
	})()

	return (
		<div className={homeStyle.cardContainer}>
			<Card bg="secondary" text="white" className={homeStyle.activityCard}>
				<Card.Body className={homeStyle.activityCardBody}>
					{(() => {
						if (props.action == "EDIT") {
							return (
							<p className={homeStyle.activityCardWords}>
								[Someone] edited <b>{props.subtopic}</b> in <i>{props.caseName}</i>
							</p>
							);
						} else if (props.action == "DELETE") {
							return (
								<p className={homeStyle.activityCardWords}>
									[Someone] deleted <b>{props.subtopic}</b> in <i>{props.caseName}</i>
								</p>
							);
						} else if (props.action == "ADD") {
							return (
								<p className={homeStyle.activityCardWords}>
									[Someone] added a new topic to <i>{props.caseName}</i>
								</p>
							);
						}
					})()}
				</Card.Body>
				<ArrowRightShort 
					className={homeStyle.activityCardArrow} 
					size="30" 
					onClick={() => {
						window.location.href=`/case/${props.caseId}`;
					}}
				/>
			</Card>
			<div className={homeStyle.activityTimeStamp}>
				{timeStamp}
			</div>
		</div>
	);
}
export default ActivityCard