import axios from 'axios';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { apiRoot } from '../../config';
import styles from '../../styles/Register.module.css';

const changepwPage = () => {
    const [verified, setVerified] = useState(false);

    if (!verified) {

        const handleSubmit = (event) => {
            event.preventDefault();
            const data = {
                "password": document.getElementById("oldpw").value
            }

            axios.post(apiRoot + "/verifypw", data, {
                headers: {'Authorization': 'Bearer ' + localStorage.getItem("jwt-token")}
            }).then(res => {
                if (res.status == 200) {
                    document.getElementById("oldpw").value = "";
                    setVerified(true);
                }
            })
        }
        return (
            <div className={styles.formContainer}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="oldpw">
                        <Form.Label>Current password</Form.Label>
                        <Form.Control type="password" placeholder="Enter current password" />
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
            </div>
        );
    } else {
        return(
            <div className={styles.formContainer}>
                <Form>
                    <Form.Group controlId="newpw">
                        <Form.Label>New password</Form.Label>
                        <Form.Control type="password" placeholder="Enter new password" />
                    </Form.Group>
                    <Form.Group controlId="confirmpw">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm password" />
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
            </div>
        );
    }
}

export default changepwPage