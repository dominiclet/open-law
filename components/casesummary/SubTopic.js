import TagButtons from './TagButtons'
import caseStyle from '../../styles/Case.module.css'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'

// props: name, content 
const CaseFact = (props) => {
    // Needed to override bootstrap css, 
    // to prevent inner Card from having rounded edges
    const cardStyle = {
        "borderLeft": "none",
        "borderRight": "none",
        "borderBottom": "none",
        "borderRadius": "0"
    };

    const isHolding = () => {
        return props.name == "Holding";
    }

    return (
        <Accordion defaultActiveKey="Facts">
            <Card style={cardStyle}>
                <Accordion.Toggle className={caseStyle.subTopicTitle} as={Card.Header} eventKey={props.name}>
                    {props.content.title}
                    {isHolding() && <TagButtons tag = {props.content.tag}/>}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={props.name}>
                    <Card.Body className="subtopic">
                        {props.content.content}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default CaseFact
