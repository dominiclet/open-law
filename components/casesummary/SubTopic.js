import caseStyle from '../../styles/Case.module.css'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import CaseTag from './CaseTag'
import { useEffect } from 'react'

// props: name, content 
const SubTopic = (props) => {
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

    // Populate the card with innerHTML once rendered
    useEffect(() => {
        const populateCard = document.getElementById(isHolding() ? "holding" + props.index : "fact" + props.index);
        populateCard.innerHTML = props.content.content;
    }, []);

    return (
        <Accordion defaultActiveKey="Facts">
            <Card style={cardStyle}>
                <Accordion.Toggle className={caseStyle.subTopicTitle} as={Card.Header} eventKey={props.name}>
                    {props.content.title}
                    {isHolding() && 
                        <div>
                            {props.content.tag.map(tag => <CaseTag tag={tag} />)}
                        </div>
                    }
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={props.name}>
                    <Card.Body className={caseStyle.subtopic} id={isHolding() ? "holding" + props.index : "fact" + props.index}>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default SubTopic 
