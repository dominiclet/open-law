import ListGroup from 'react-bootstrap/ListGroup'
import caseStyle from '../../styles/Case.module.css'

const RelatedCases = () => {
    return ( 
        <div>
            <h1 className={caseStyle.relatedCases}>Related Cases</h1>
            <ListGroup>
                <ListGroup.Item 
                    className={caseStyle.relatedCases}
                    action href="caseid"
                >
                    Case 1
                </ListGroup.Item>
                <ListGroup.Item className={caseStyle.relatedCases} action href="caseid">Case 2</ListGroup.Item>
            </ListGroup>
        </div>
    )
}

export default RelatedCases
