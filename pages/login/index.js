import axios from "axios";
import { apiRoot } from "../../config";
import { useRouter } from 'next/router';
import loginStyle from '../../styles/Login.module.css';
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Link from 'next/link';
import Image from 'next/image';


const loginPage = () => {
	const router = useRouter();

	// State tracks if login is in loading state
	const [loading, setLoading] = useState(false);

	// Check if already logged in
	useEffect(() => {
		const token = localStorage.getItem("jwt-token");
		if (token) {
			axios.post(apiRoot + "/token/ping", {}, {
				headers: {'Authorization': 'Bearer ' + token}
			}).then(res => {
				if (res.status == 200) {
					router.push("/");
				}
			}).catch(e => {
				if (e.response.status == 401) {
					localStorage.removeItem("jwt-token");
				}
			})
		}
	}, []);

	// Submit functionality
	const handleSubmit = () => {
		// Display loading spinner
		setLoading(true);

		const data = {
			username: document.getElementById("username").value,
			password: document.getElementById("password").value
		};

		axios.post(apiRoot + "/login", data)
			.then(res => {
				if (res.status == 200) {
					localStorage.setItem("jwt-token", res.data["access_token"]);
					router.push("/");
				} 
			}).catch((e) => {
				if (e.response.status == 401) {
					document.getElementById("username").style.borderColor = "red";
					document.getElementById("password").style.borderColor = "red";
					document.getElementById("warning").innerHTML = "Wrong username or password";
					console.error("Bad username or password");
				} else {
					throw e;
				}
				setLoading(false);
			});
	};

	// Handle enter functionality 
	const handleEnterKey = (e) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	}

	return (
		<div className={loginStyle.loginContainer}>
			<div className={loginStyle.logoContainer}>
				<Image 
					src="/big_brain_boi.png" 
					width={300}
					height={300}
					alt="Smiley face" 
				/>
			</div>
			<div className={loginStyle.inputContainer}>
				<input 
					autoFocus
					className={loginStyle.input} 
					onKeyPress={handleEnterKey}
					id="username" 
					placeholder="Username" 
				/>
			</div>
			<div className={loginStyle.inputContainer}>
				<input 
					className={loginStyle.input} 
					onKeyPress={handleEnterKey}
					id="password" 
					placeholder="Password" 
					type="password" 
				/>
			</div>
			<div id="warning" className={loginStyle.warning}></div>
			{(() => {
				return (loading ? <Spinner animation="border" className={loginStyle.loadingSpinner}/>
				: <button className={loginStyle.submit} onClick={handleSubmit} id="loginButton">LOGIN</button>);
			})()}
			<div className={loginStyle.registerContainer}>
				<Link href="/register">Register</Link>
			</div>
		</div>
	);
}

export default loginPage