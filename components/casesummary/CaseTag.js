import { Badge } from 'react-bootstrap';
import { useRouter } from 'next/router';
import caseStyle from '../../styles/Case.module.css';

const CaseTag = (props) => {
	const router = useRouter();
	const handleClick = (e) => {
		e.stopPropagation();
		router.push(`/category/${props.tag}`)
	}

	return (
		<Badge pill variant="dark" onClick={handleClick} className={caseStyle.tags}>
			{props.tag}
		</Badge>
	);
}

export default CaseTag
