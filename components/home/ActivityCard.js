import Card from 'react-bootstrap/Card';
import homeStyle from '../../styles/Home.module.css';
import Link from 'next/link'
import { ArrowRightShort } from 'react-bootstrap-icons';

const ActivityCard = () => {
	return (
		<div className={homeStyle.cardContainer}>
			<Card bg="secondary" text="white" className={homeStyle.activityCard}>
				<Card.Body className={homeStyle.activityCardBody}>
					[Someone(Link to profile)] edited <i>Plaintiff v Defendant</i>
				</Card.Body>
				<ArrowRightShort 
					className={homeStyle.activityCardArrow} 
					size="30" 
					onClick={() => {
						window.location.href='/case/1';
					}}
				/>
			</Card>
			<div className={homeStyle.activityTimeStamp}>
				X hours ago
			</div>
		</div>
	);
}
export default ActivityCard