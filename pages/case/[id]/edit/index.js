import { useRouter } from 'next/router';
import CaseEditor from '../../../../components/casesummary/edit/CaseEditor';
import Jumbotron from 'react-bootstrap/Jumbotron';
import caseEditStyle from '../../../../styles/CaseEdit.module.css'

const caseEditPage = () => {
    const router = useRouter();
    const {id} = router.query;

    // Reduce padding for Jumbotron
    const jumboStyle = {
        "padding": "1rem 2rem",
        "width": "60vw",
        "margin": "auto",
        "minWidth": "1000px"
    };
    
    return(
        <div>
            <Jumbotron style={jumboStyle}>
                <h1>Case name</h1>
                <p>Case citation</p>
            </Jumbotron>
            <div className="center">
                <h3 className={caseEditStyle.header}>Facts</h3>
                <CaseEditor subTopic="Sub-fact"/>
                <h3 className={caseEditStyle.header}>Holding</h3>
                <CaseEditor subTopic="Sub-holding"/>
            </div>
        </div>
    );
}
 export default caseEditPage