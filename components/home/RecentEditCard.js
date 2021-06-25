import Card from 'react-bootstrap/Card';
import homeStyle from '../../styles/Home.module.css';
import { PencilSquare } from 'react-bootstrap-icons';

const RecentEditCard = () => {
	return (
		<div className={homeStyle.cardContainer}>
			<Card bg="secondary" text="white" className={homeStyle.activityCard}>
				<Card.Body className={homeStyle.activityCardBody}>
					Continue editing for <i>Plaintiff v Defendant</i>
				</Card.Body>
				<PencilSquare 
					size="25"
					className={homeStyle.editSign}
					onClick={() => {
						window.location.href = "/case/60acd4b54123e7a0620c1d30/edit";
					}}
				/>
			</Card>
		</div>
	);
}

export default RecentEditCard