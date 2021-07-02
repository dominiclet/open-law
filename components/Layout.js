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

    const router = useRouter();

    // Handles submitting new case
    const handleSubmit = () => {
        const caseName = document.getElementById("caseName").value;
        if (caseName.length < 3) {
            alert("Enter a valid case name!");
        } else {
            const data = {
                caseName: caseName,
                time: new Date()
            };
            
            // Retrieve token from storage
            const token = localStorage.getItem("jwt-token");

            if (token) {
                axios.post(apiRoot + "/addNewCase", data, {
                    headers: {'Authorization': 'Bearer ' + token}
                }).then(res => {
                        if (res.status == 200) {
                            // Redirect to the newly created case's edit page
                            handleClose();
                            window.location.href = `/case/${res.data}/edit`;
                        } 
                    }).catch(e => {
                        console.error(e);
                        router.push("/login");
                    });
            } else {
                router.push("/login");
            }
        }
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                    </Modal.Footer>
                </Form>
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
