import Card from 'react-bootstrap/Card';
import homeStyle from '../../styles/Home.module.css';
import { PencilSquare } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';

const RecentEditCard = (props) => {
	// props.caseName: Name of relevant case
	// props.caseId: ID of relevant case
	
	const router = useRouter();

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
						router.push(`/case/${props.caseId}/edit`);
					}}
				/>
			</Card>
		</div>
	);
}

export default RecentEditCard