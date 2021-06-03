import Button from 'react-bootstrap/Button';
import caseStyle from '../../styles/Case.module.css';

const TagButton = ({tag}) => {
    return (
        <Button variant="outline-primary" className={caseStyle.tags}>Button tag</Button>
    )
}

export default TagButton
