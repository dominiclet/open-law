import caseStyle from '../../styles/Case.module.css';
import InnerCase from './InnerCase';
import Card from 'react-bootstrap/Card';

const OuterCase = (props) => {
    // To override min-width, make sure that case summary component is not too small
    const width = {"minWidth": "1000px"};

    return(
        <Card className={caseStyle.casesummary} style={width}>
            <Card.Title className={caseStyle.casename}>Case Name ({props.info})</Card.Title>
            <InnerCase name="Facts" />
            <InnerCase name="Holding" />
        </Card>
    );
}

export default OuterCase