import caseStyle from '../../styles/Case.module.css';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

const SubTopic = (props) => {
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
                <Accordion.Toggle className={caseStyle.subTopicTitle} as={Card.Header} eventKey={props.name}>
                    Sub-Header goes here
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={props.name}>
                    <Card.Body className="subtopic">
                        Facts cards are expanded by default. These inner information should be passed as props.
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default SubTopic
