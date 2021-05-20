import Card from 'react-bootstrap/Card';
import SubTopic from './SubTopic';
import caseStyle from '../../styles/Case.module.css';

/*
InnerCase expects a property "name" representing
the portion of the inner judgment we are referring to,
either "Facts" or "Holding".
*/
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
            <SubTopic name={props.name}/>
            <SubTopic name={props.name}/>
        </Card>
    );
};

export default InnerCase