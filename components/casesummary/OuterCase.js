import caseStyle from '../../styles/Case.module.css';
import InnerCase from './InnerCase';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

const OuterCase = ({entry}) => {
    // To override min-width, make sure that case summary component is not too small
    const width = {"min-width": "1000px"};

    return(
        <Card className={caseStyle.casesummary} style={width}>
            <Card.Title className={caseStyle.casename}>{entry.name}</Card.Title>
            <InnerCase name="Facts" content = {entry.facts}/>
            <InnerCase name="Holding" content = {entry.holding}/>
        </Card>
    );
}
export default OuterCase