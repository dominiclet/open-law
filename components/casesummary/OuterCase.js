import Link from 'next/link'
import caseStyle from '../../styles/Case.module.css';
import caseEditStyle from '../../styles/CaseEdit.module.css';
import InnerCase from './InnerCase';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

const OuterCase = (props) => {
    // To override min-width, make sure that case summary component is not too small
    const width = {"min-width": "1000px"};
    const date = new Date(props.entry.lastEdit);

    return(
        <Card className={caseStyle.casesummary} style={width}>
            <Card.Title className={caseStyle.casename}>
                <Link href={props.entry.link}>{props.entry.name}</Link>
                <br/>
                {props.entry.citation.map( (cite) => (
                    <>({cite}) &ensp;</>
                ))}
            </Card.Title>
            <InnerCase name="Facts" content = {props.entry.facts}/>
            <InnerCase name="Holding" content = {props.entry.holding}/>
            <p className={caseEditStyle.editTimeStamp}>
                Last edited by [someone] at {date.toLocaleTimeString("en-SG")} on {date.toLocaleDateString("en-SG")}
            </p>
        </Card>
    );
}
export default OuterCase