import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from '../../styles/Register.module.css';

const registerPage = () => {
	// For descriptions in the form, reduces font size
	const mutedTextStyle = {
		"fontSize": "0.8rem"
	};

	// Styling for text checking matching passwords
	const matchingPasswordStyle = {
		"transitionDuration": "0.4s"
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

	return (
		<div className={styles.formContainer}>
			<h4>Register</h4>
			<Form>
				<Form.Group controlId="name">
					<Form.Label>Full name</Form.Label>
					<Form.Control type="text" placeholder="Enter full name" />
				</Form.Group>
				<Form.Group controlId="academicYear">
					<Form.Label>Academic year</Form.Label>
					<Form.Control as="select">
						<option>1</option>
						<option>2</option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
					</Form.Control>
					<Form.Text className="text-muted" style={mutedTextStyle}>
						Based on academic year 2021/2022
					</Form.Text>
				</Form.Group>
				<Form.Group controlId="username">
					<Form.Label>Username</Form.Label>
					<Form.Control type="text" placeholder="Enter username" />
					<Form.Text className="text-muted" style={mutedTextStyle}>
						This will be your display name, as well as the username you use to login.
					</Form.Text>
				</Form.Group>
				<Form.Group controlId="password">
					<Form.Label>Password</Form.Label>
					<Form.Control id="password" type="password" placeholder="Enter password" onChange={handleEnterPassword} />
				</Form.Group>
				<Form.Group className={styles.confirmPassword} controlId="confirmPassword">
					<Form.Label>Confirm password</Form.Label>
					<Form.Control type="password" placeholder="Enter password again" id="confirmpw" onChange={handleEnterPassword} />
				</Form.Group>
				<Button type="submit">Submit</Button>
			</Form>
		</div>
	);
}

export default registerPage