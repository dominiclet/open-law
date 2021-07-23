import axios from "axios";
import { apiRoot } from "../../config";
import { useRouter } from 'next/router';
import loginStyle from '../../styles/Login.module.css';
import { useEffect } from "react";


const loginPage = () => {
	const router = useRouter();

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
				}
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
				[Placeholder]
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
			<button className={loginStyle.submit} onClick={handleSubmit}>LOGIN</button>
		</div>
	);
}

export default loginPage