import styles from '../styles/Layout.module.css'
import NavigationBar from './NavigationBar'
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { apiRoot } from '../config';
import { useRouter } from 'next/router';
import withAuth from '../helpers/withAuth';

const Layout = (props) => {
    // States to handle add case modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // State to handle check duplicate cases modal
    const [showDuplicateCaseModal, setShowDuplicateCaseModal] = useState(false);
    // State to store similar cases data
    const [similarCasesData, setSimilarCasesData] = useState();
    // State to store input case data
    const [addCaseData, setAddCaseData] = useState();

    const router = useRouter();

    // Handles submitting new case
    const handleSubmit = () => {
        const caseName = document.getElementById("caseName").value;
        const caseCitation = document.getElementById("caseCitation").value;
        if (caseName.length < 3) {
            alert("Enter a valid case name!");
        } else if (!caseCitation) {
            alert("Please enter 1 case citation");
        } else {
            const data = {
                caseName: caseName,
                caseCitation: caseCitation,
                time: new Date()
            };
            
            // Retrieve token from storage
            const token = localStorage.getItem("jwt-token");

            if (token) {
                axios.post(apiRoot + "/addNewCase/0", data, {
                    headers: {'Authorization': 'Bearer ' + token}
                }).then(res => {
                        if (res.status == 200) {
                            // Case succcessfully created
                            // Redirect to the newly created case's edit page
                            handleClose();
                            // Need to use this instead of router.push
                            // Push does not work if you are on an edit page already
                            window.location.href = `/case/${res.data}/edit`;
                        } else if (res.status == 202) {
                            // Case not added as there are highly similar cases, need checking
                            handleClose();
                            setAddCaseData(data);
                            setSimilarCasesData(res.data);
                            setShowDuplicateCaseModal(true);
                        }
                    }).catch(e => {
                        if (e.response.status == 401) {
                            localStorage.removeItem("jwt-token");
                            router.push("/login");
                        } else {
                            throw e;
                        }
                    });
            } else {
                router.push("/login");
            }
        }
    }

    // Handles submitting the case after confirming it is not a duplicate
    const handleConfirmedSubmit = () => {
        axios.post(apiRoot + "/addNewCase/1", addCaseData, {
            headers: {'Authorization': 'Bearer ' + localStorage.getItem("jwt-token")}
        }).then(res => {
            if (res.status == 200) {
                setShowDuplicateCaseModal(false);
                window.location.href = `/case/${res.data}/edit`;
            }
        })
    }

    return (
        <>
            <NavigationBar addCase={handleShow} />
            <Modal
                size="lg"
                show={show}
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add new case</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Case name</Form.Label>
                            <Form.Control type="text" placeholder="Enter case name" id="caseName"
                                onKeyDown={(e) => {
                                    if (e.key == "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Case citation</Form.Label>
                            <Form.Control 
                                type="text" 
                                className={styles.citationInput}
                                size="sm" 
                                placeholder="Enter 1 case citation" 
                                id="caseCitation"
                                onKeyDown={(e) => {
                                    if (e.key == "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                                />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal
                size='lg'
                show={showDuplicateCaseModal}
                onHide={() => setShowDuplicateCaseModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Check similar cases</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { showDuplicateCaseModal ? 
                        <p>
                            The case you are attempting to add (<i>{addCaseData.caseName}</i> {addCaseData.caseCitation + ") "}
                            seems similar to these cases (ranked in order of relevance) that already exist:
                            <ul>
                                {similarCasesData.filter(caseData => caseData.score >= 1).map((caseData, index) => {
                                    return (
                                        <li key={index}>
                                            <i>{caseData.name}</i> {caseData.citation.join("; ")}
                                        </li>
                                    );
                                })}
                            </ul>
                            Are you sure you are not adding a duplicate case?
                        </p>
                        : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDuplicateCaseModal(false)}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleConfirmedSubmit}>Yes</Button>
                </Modal.Footer>
            </Modal>
            <div className = {styles.container}>
                <main className = {styles.main}>
                    {props.children}
                </main>
            </div>  
        </>
    )
}

export default withAuth(Layout)
