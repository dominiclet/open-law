import Card from 'react-bootstrap/Card'
import SubTopic from './SubTopic'
import caseStyle from '../../styles/Case.module.css'

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