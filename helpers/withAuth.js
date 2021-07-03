import axios from "axios";
import { apiRoot } from "../config";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


// Higher order component that should be used to wrap page components
// Only allows child components to be displayed if client has a jwt-token
// and the jwt-token is verified.
// Otherwise, redirects the client to the login page.
const withAuth = (WrappedComponent) => {
	return (props) => {
		const router = useRouter();
		const [verified, setVerified] = useState(false);

		useEffect(() => {
			const accessToken = localStorage.getItem("jwt-token");
			if (!accessToken) {
				router.push("/login");
			} else {
				axios.post(apiRoot + "/token/ping", {}, {
					headers: {'Authorization': 'Bearer ' + accessToken}
				}).then(res => {
					if (res.status == 200) {
						setVerified(true);
					} 
				}).catch(e => {
					// If error, reroute to login page
					localStorage.removeItem("jwt-token");
					router.push("/login");
				});
			}
		}, []);

		if (verified) {
			return <WrappedComponent {...props} />;
		} else {
			return null;
		}
	};
}

export default withAuth;