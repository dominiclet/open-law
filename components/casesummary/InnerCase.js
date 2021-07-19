import Card from 'react-bootstrap/Card';
import SubTopic from './SubTopic';
import caseStyle from '../../styles/Case.module.css';
import { Accordion } from 'react-bootstrap';

/*
InnerCase expects a property "name" representing
the portion of the inner judgment we are referring to,
either "Facts", "Issues" or "Holding".
*/
// Props: name, content
const InnerCase = (props) => {
    // Needed to override bootstrap css, 
    // to prevent inner Card from having rounded edges
    const cardStyle = {
        "border-left": "none",
        "border-right": "none",
        "border-bottom": "none",
        "border-radius": "0"
    };

    // Handle issues separately because simpler
    if (props.name === "Issues") {

        return (
            <Accordion defaultActiveKey="issues">
                <Card style={cardStyle}>
                        <Accordion.Toggle 
                            as={Card.Header} 
                            className={caseStyle.innerCaseTitle}
                            eventKey="issues"
                        >
                            {props.name}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="issues">
                            <Card.Body className={caseStyle.subtopic}>
                                <ol>
                                    {props.content.map((issue, index) => {
                                        return (
                                            <li key={index}>{issue}</li>
                                        );
                                    })}
                                </ol>
                            </Card.Body>
                        </Accordion.Collapse>
                </Card>
            </Accordion>
        );
    }

    return (
        <Card style={cardStyle}>
            <Card.Title className={caseStyle.innerCaseTitle}>{props.name}</Card.Title>
                {props.content.map((subTopic) => ( // Maps over each sub-topic in the case content
                    <SubTopic name = {props.name} content = {subTopic} />
                ))}
        </Card>
    );
};

export default InnerCase