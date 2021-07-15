import axios from 'axios';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { apiRoot } from '../../config';
import styles from '../../styles/Register.module.css';
import { useRouter } from 'next/router';

const changepwPage = () => {
    const router = useRouter();
    const [verified, setVerified] = useState(false);

    // Style for validation warnings
    const warningStyle = {
        "fontSize": "0.8rem",
        "color": "red"
    }

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
                    document.getElementById("passwordNote").innerHTML = null;
                    setVerified(true);
                }
            }).catch(e => {
                if (e.response.status == 401) {
                    document.getElementById("passwordNote").innerHTML = "Incorrect password";
                } else {
                    throw e;
                }
            })
        }
        return (
            <div className={styles.formContainer}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="oldpw">
                        <Form.Label>Current password</Form.Label>
                        <Form.Control type="password" placeholder="Enter current password" />
                        <Form.Text id="passwordNote" style={warningStyle}></Form.Text>
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
            </div>
        );
    } else {
        // Check matching passwords
        const handleEnterPassword = (e) => {
            const passwordElem = document.getElementById("newpw");
            const confirmPasswordElem = document.getElementById("confirmpw");
            if (!passwordElem.value) {
                confirmPasswordElem.style.boxShadow = null;
            } else if (passwordElem.value && passwordElem.value !== confirmPasswordElem.value) {
                confirmPasswordElem.style.boxShadow = "inset 0 1px 1px rgba(0,0,0,.075),0 0 5px 1px red";
            } else if (passwordElem.value === confirmPasswordElem.value) {
                confirmPasswordElem.style.boxShadow = "inset 0 1px 1px rgba(0,0,0,.075),0 0 5px 1px green";
            }
        }

        // Handle submit button
        const handleSubmit = (event) => {
            event.preventDefault();

            // Form validation
            const password = document.getElementById("newpw");
            const confirmPw = document.getElementById("confirmpw");

            document.getElementById("newpwNote").innerHTML = null;
            document.getElementById("confirmpwNote").innerHTML = null;

            let noError = true;
            if (password.value.length < 8) {
                // Check that password is at least 8 characters long
                document.getElementById("newpwNote").innerHTML = "Password must be at least 8 characters long."
                noError = false;
            }
            if (password.value !== confirmPw.value) {
                // Check that confirm password is the same as password
                document.getElementById("confirmpwNote").innerHTML = "Password does not match.";
                noError = false;
            }

            if (noError) {
                const data = {
                    "newPassword": password.value
                }

                // Send request to change password
                axios.post(apiRoot + "/changepw", data, {
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem("jwt-token")}
                }).then(res => {
                    if (res.status == 200) {
                        alert("Password successfully changed!");
                        localStorage.removeItem("jwt-token");
                        router.push("/login");
                    }
                })
            }
        }

        return(
            <div className={styles.formContainer}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="newpw">
                        <Form.Label>New password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter new password" 
                            onChange={handleEnterPassword}
                        />
                        <Form.Text id="newpwNote" style={warningStyle}></Form.Text>
                    </Form.Group>
                    <Form.Group controlId="confirmpw">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Confirm password" 
                            onChange={handleEnterPassword}
                        />
                        <Form.Text id="confirmpwNote" style={warningStyle}></Form.Text>
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
            </div>
        );
    }
}

export default changepwPage