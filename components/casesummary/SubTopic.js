import TagButton from './TagButton';
import caseStyle from '../../styles/Case.module.css';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

const SubTopic = ({name, content}) => {
    // Needed to override bootstrap css, 
    // to prevent inner Card from having rounded edges
    const cardStyle = {
        "borderLeft": "none",
        "borderRight": "none",
        "borderBottom": "none",
        "borderRadius": "0"
    };
    
    return (
        <Accordion defaultActiveKey="Facts">
            <Card style={cardStyle}>
                <Accordion.Toggle className={caseStyle.subTopicTitle} as={Card.Header} eventKey={name}>
                    {content.title}
                    <TagButton/>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={name}>
                    <Card.Body className="subtopic">
                        {content.content}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default SubTopic
