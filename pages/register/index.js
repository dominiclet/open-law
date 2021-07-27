import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from '../../styles/Register.module.css';
import { apiRoot } from '../../config';
import axios from 'axios';
import { useRouter } from 'next/router';

const registerPage = () => {
	const router = useRouter();

	// For descriptions in the form, reduces font size
	const mutedTextStyle = {
		"fontSize": "0.8rem"
	};

	// Styling for form validation warnings 
	const warningStyle = {
		"fontSize": "0.8rem",
		"color": "red"
	}

	// Check matching passwords
	const handleEnterPassword = (e) => {
		const passwordElem = document.getElementById("password");
		const confirmPasswordElem = document.getElementById("confirmpw");
		if (passwordElem.value && passwordElem.value !== confirmPasswordElem.value) {
			confirmPasswordElem.style.boxShadow = "inset 0 1px 1px rgba(0,0,0,.075),0 0 5px 1px red";
		} else if (passwordElem.value === confirmPasswordElem.value) {
			confirmPasswordElem.style.boxShadow = "inset 0 1px 1px rgba(0,0,0,.075),0 0 5px 1px green";
		} 
	}

	// Handle submit button
	const handleSubmit = (event) => {
		event.preventDefault();

		// Form validation 
		const name = document.getElementById("name");
		const username = document.getElementById("username");
		const password = document.getElementById("password");
		const confirmPw = document.getElementById("confirmpw");
		const email = document.getElementById("email");
		const registerToken = document.getElementById("registerToken");

		document.getElementById("fullNameNote").innerHTML = null;
		document.getElementById("usernameNote").innerHTML = null;
		document.getElementById("passwordNote").innerHTML = null;
		document.getElementById("confirmpwNote").innerHTML = null;
		document.getElementById("emailNote").innerHTML = null;
		document.getElementById("tokenNote").innerHTML = null;
		let noError = true;
		if (name.value.length == 0) {
			// Check that full name is not empty
			document.getElementById("fullNameNote").innerHTML = "Full Name is required.";
			noError = false;
		}
		if (username.value.length == 0) {
			// Check that username is not empty
			document.getElementById("usernameNote").innerHTML = "Username is required.";
			noError = false;
		}
		if (username.value.includes(" ")) {
			// Do not allow spaces in username
			document.getElementById("usernameNote").innerHTML = "No spaces are allowed in username.";
			noError = false;
		}
		if (username.value.length > 30) {
			// Limit length of username
			document.getElementById("usernameNote").innerHTML = "Username must be less than 30 characters long.";
			noError = false;
		}
		if (email.value.length == 0) {
			// Check that email is not empty
			document.getElementById("emailNote").innerHTML = "Email is required";
			noError = false;
		}
		if (email.value.includes(" ")) {
			// Do not allow spaces in email
			document.getElementById("emailNote").innerHTML = "No spaces in email."
			noError = false;
		}
		if (password.value.length < 8) {
			// Check that password is at least 8 characters long
			document.getElementById("passwordNote").innerHTML = "Password must be at least 8 characters long.";
			noError = false;
		}
		if (password.value !== confirmPw.value) {
			// Check that confirm password is the same as password
			document.getElementById("confirmpwNote").innerHTML = "Password does not match.";
			noError = false;
		}
		if (registerToken.value.length == 0) {
			// Check that register token is not empty
			document.getElementById("tokenNote").innerHTML = "Get registration token from Ivan.";
			noError = false;
		}
		if (document.getElementById("class").value == 0) {
			// Check that class is selected
			document.getElementById("classNote").innerHTML = "Class must be specified.";
			noError = false;
		}

		if (noError) {
			const data = {
				"name": name.value,
				"class": document.getElementById("class").value,
				"username": username.value,
				"email": email.value,
				"password": password.value,
				"token": registerToken.value
			}

			axios.post(apiRoot + "/register", data)
				.then(res => {
					if (res.status == 200) {
						alert("Registration successful");
						router.push("/login");
					}
				}).catch(e => {
					if (e.response.status == 401) {
						alert("Wrong registration token!");
					} else if (e.response.status == 409) {
						document.getElementById("usernameNote").innerHTML = "Username taken!";
					} else {
						throw e;
					}
				});
		}
	}

	return (
		<div className={styles.formContainer}>
			<h4>Register</h4>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="name">
					<Form.Label>Full name</Form.Label>
					<Form.Control type="text" placeholder="Enter full name" />
					<Form.Text id="fullNameNote" style={warningStyle}></Form.Text>
				</Form.Group>
				<Form.Group controlId="class">
					<Form.Label>Class of</Form.Label>
					<Form.Control as="select">
						<option value={0}>Select class</option>
						<option value={"2022"}>2022 (Matriculated 2018)</option>
						<option value={"2023"}>2023 (Matriculated 2019)</option>
						<option value={"2024"}>2024 (Matriculated 2020)</option>
						<option value={"2025"}>2025 (Matriculated 2021)</option>
					</Form.Control>
					<Form.Text id="classNote" style={warningStyle}>
					</Form.Text>
				</Form.Group>
				<Form.Group controlId="username">
					<Form.Label>Username</Form.Label>
					<Form.Control type="text" placeholder="Enter username" />
					<Form.Text id="usernameNote" style={warningStyle}></Form.Text>
					<Form.Text className="text-muted" style={mutedTextStyle}>
						This will be your display name, as well as the username you use to login.
					</Form.Text>
				</Form.Group>
				<Form.Group controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control type="text" placeholder="Enter email" />
					<Form.Text id="emailNote" style={warningStyle}></Form.Text>
				</Form.Group>
				<Form.Group controlId="password">
					<Form.Label>Password</Form.Label>
					<Form.Control id="password" type="password" placeholder="Enter password" onChange={handleEnterPassword} />
					<Form.Text id="passwordNote" style={warningStyle}></Form.Text>
				</Form.Group>
				<Form.Group className={styles.confirmPassword} controlId="confirmPassword">
					<Form.Label>Confirm password</Form.Label>
					<Form.Control type="password" placeholder="Enter password again" id="confirmpw" onChange={handleEnterPassword} />
					<Form.Text id="confirmpwNote" style={warningStyle}></Form.Text>
				</Form.Group>
				<Form.Group controlId="registerToken">
					<Form.Label>Token</Form.Label>
					<Form.Control type="password" placeholder="Enter registration token" />
					<Form.Text id="tokenNote" style={warningStyle}></Form.Text>
				</Form.Group>
				<Button type="submit">Submit</Button>
			</Form>
		</div>
	);
}

export default registerPage