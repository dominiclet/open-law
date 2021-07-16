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

    // check if there is link to full case
    const missingLink = () => {
        return props.entry.link === undefined;
    }

    return(
        <Card className={caseStyle.casesummary} style={width}>
            <Card.Title className={caseStyle.casename}>
                {!missingLink() && <Link href={props.entry.link}>{props.entry.name}</Link>}
                {missingLink() && <>{props.entry.name}</>}
                <br/>
                {props.entry.citation.map( (cite) => (
                    <>({cite}) &ensp;</>
                ))}
            </Card.Title>
            <InnerCase name="Facts" content = {props.entry.facts}/>
            <InnerCase name="Issues" content = {props.entry.issues}/>
            <InnerCase name="Holding" content = {props.entry.holding}/>
            <p className={caseEditStyle.editTimeStamp}>
                Last edited by {props.entry.lastEditBy} at {date.toLocaleTimeString("en-SG")} on {date.toLocaleDateString("en-SG")}
            </p>
        </Card>
    );
}
export default OuterCase