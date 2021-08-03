import Link from 'next/link'
import caseStyle from '../../styles/Case.module.css';
import caseEditStyle from '../../styles/CaseEdit.module.css';
import InnerCase from './InnerCase';
import Card from 'react-bootstrap/Card';
import { PencilSquare } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const OuterCase = (props) => {
    const date = new Date(props.entry.lastEdit);

    // check if there is link to full case
    const missingLink = () => {
        return props.entry.link === undefined;
    }

    return(
        <Card className={caseStyle.casesummary}>
            <Card.Title className={caseStyle.caseNameContainer}>
                <div className={caseStyle.casename}>
                    {!missingLink() && <Link href={props.entry.link}>{props.entry.name}</Link>}
                    {missingLink() && <>{props.entry.name}</>}
                </div>
                <p className={caseStyle.citations}>
                    {props.entry.citation.join("; ")}
                </p>
            </Card.Title>
            <InnerCase name="Facts" content = {props.entry.facts}/>
            <InnerCase name="Issues" content = {props.entry.issues}/>
            <InnerCase name="Holding" content = {props.entry.holding}/>
            <p className={caseEditStyle.editTimeStamp}>
                {props.entry.lastEdit ? 
                    `Last edited by ${props.entry.lastEditBy} at ${date.toLocaleTimeString("en-SG")} on ${date.toLocaleDateString("en-SG")}`
                    : "Newly added case"
                }
            </p>
        </Card>
    );
}
export default OuterCase