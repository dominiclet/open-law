import homeStyle from '../../styles/Home.module.css';
import { PencilSquare } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';

const RecentEditCard = (props) => {
	// props.caseName: Name of relevant case
	// props.caseId: ID of relevant case
	// props.caseCitation: Array citations of case
	
	const router = useRouter();

	return (
		<div className={homeStyle.cardContainer}>
				<div className={homeStyle.caseIdentifierContainer}>
					<p className={homeStyle.caseName}>{props.caseName}</p>
					<p className={homeStyle.caseCitation}>
						{props.caseCitation.join("; ")}	
					</p>
				</div>
				<PencilSquare 
					size="25"
					className={homeStyle.editSign}
					onClick={() => {
						router.push(`/case/${props.caseId}/edit`);
					}}
				/>
		</div>
	);
}

export default RecentEditCard