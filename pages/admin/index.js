import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { apiRoot } from "../../config";
import styles from "../../styles/Admin.module.css";

const adminPage = () => {
	const router = useRouter();

	// State stores loading vs loaded state
	const [loaded, setLoaded] = useState(false);
	// State stores whether user is authenticated
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	// State stores loaded user data
	const [data, setData] = useState();
	
	useEffect(() => {
		axios.get(apiRoot + "/admin/users", {
			headers: {'Authorization': 'Bearer ' + localStorage.getItem("jwt-token")}
		}).then(res => {
			if (res.status == 200) {
				setData(res.data);
				setLoaded(true);
				console.log(res.data);
			}
		}).catch(err => {
			if (err.response.status == 401) {
				localStorage.removeItem("jwt-token");
				router.push("/login");
			} else if (err.response.status == 403) {
				alert("You do not have access rights for this page.");
				router.push("/");
			} else {
				throw err;
			}
		})
	}, []);
	
	if (loaded) {
		// Require admin to enter password again
		if (!isAuthenticated) {
			// Handle verify password
			const handleVerifyPassword = (event) => {
				if (event.key == "Enter") {
					axios.post(apiRoot + "/verifypw", {
						"password": event.target.value
					}, {
						headers: {'Authorization': 'Bearer ' + localStorage.getItem("jwt-token")}
					}).then(res => {
						if (res.status == 200) {
							setIsAuthenticated(true);
						}
					}).catch(err => {
						if (err.response.status == 401) {
							alert(err.response.data.msg);
						}
					})
				}
			}
			return (<input autoFocus type="password" onKeyPress={handleVerifyPassword} />);
		}

		return (
			<Table striped bordered hover className={styles.tableStyling}>
				<thead>
					<tr>
						<th>#</th>
						<th>Username</th>
						<th>Name</th>
						<th>Email</th>
						<th>Last login</th>
						<th>Edit</th>
						<th>Mod</th>
						<th>Admin</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{data.map((user, index) => {
						const date = new Date(user.lastLogin);

						// Handle reset password
						const handleResetPw = (event) => {
							event.preventDefault();
							const yes = confirm(`Reset password for ${user.username} (${user.name})?`)

							if (yes) {
								axios.post(apiRoot + `/admin/resetpw`, {
									userId: user._id,
								}, {
									headers: {'Authorization': 'Bearer ' + localStorage.getItem("jwt-token")}
								}).then(res => {
									if (res.status == 200) {
										alert(`New password is ${res.data}`)
									}
								})
							}
						}

						return (
							<tr>
								<td>{index+1}</td>
								<td>{user.username}</td>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>{date.toLocaleDateString("en-SG") + " | " + date.toLocaleTimeString("en-SG")}</td>
								<td>{user.permissions.edit}</td>
								<td>{user.permissions.mod}</td>
								<td>{user.permissions.admin}</td>
								<td><a href="/admin" onClick={handleResetPw}>Reset password</a></td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		);
	} else {
		return (
			<Spinner animation="border" className={styles.loadingSpinner} />
		);
	}
}

export default adminPage