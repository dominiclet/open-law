import axios from "axios";
import { apiRoot } from "../../config";
import { useRouter } from 'next/router';


const loginPage = () => {
	const router = useRouter();

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
					console.log("Bad username or password");
				}
			});
	};

	return (
		<div>
			Username
			<input id="username"/><br/>
			Password
			<input id="password"/><br />
			<button onClick={handleSubmit}>Submit</button>
		</div>
	);
}

export default loginPage