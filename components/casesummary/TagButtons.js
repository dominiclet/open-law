import Button from 'react-bootstrap/Button';
import caseStyle from '../../styles/Case.module.css';

// Props: tags (array of tags either from individual holding or case)
const TagButtons = (props) => {
    return (
        <>
            {props.tags.map((tag) => (
                <Button variant="outline-primary" className={caseStyle.tags}>{tag}</Button>
            ))}
        </>
    )
}

export default TagButtons
