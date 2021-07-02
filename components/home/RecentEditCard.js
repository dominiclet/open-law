import Card from 'react-bootstrap/Card';
import homeStyle from '../../styles/Home.module.css';
import { PencilSquare } from 'react-bootstrap-icons';

const RecentEditCard = (props) => {
	// props.caseName: Name of relevant case
	// props.caseId: ID of relevant case

	return (
		<div className={homeStyle.cardContainer}>
			<Card bg="secondary" text="white" className={homeStyle.activityCard}>
				<Card.Body className={homeStyle.activityCardBody}>
					Continue editing for <i>{props.caseName}</i>
				</Card.Body>
				<PencilSquare 
					size="25"
					className={homeStyle.editSign}
					onClick={() => {
						window.location.href = `/case/${props.caseId}/edit`;
					}}
				/>
			</Card>
		</div>
	);
}

export default RecentEditCard