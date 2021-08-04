import styles from "../../styles/Readme.module.css";

const readmePage = () => {
	return (
		<div className={styles.bodyContainer}>
			<div className={styles.postContainer}>
				<h5>Bug reports and suggestions</h5>
				<p>
					Hi! Thanks so much for using this application. Currently, while testing the workability of this 
					web application, we are hoping to uncover bug or issues that exist. We would therefore really appreciate 
					if you could notify us of any bugs (application-breaking ones or minor ones alike) at this {" "}
					<b><a href="https://discord.gg/4CDFxBWnH7">discord channel</a></b>.
				</p>
				<p>
					If you have any suggestions on how to improve the user experience, ideas for more functions, or just feedback 
					in general, please drop us a message at the discord channel as well.
				</p>
			</div>
			<div className={styles.postContainer}>
				<h5>Race condition</h5>
				<p>
					Because your edits are not updated in real-time, but only when you press the upload button, there could 
					potentially be a problem when two people are editing the same case at the same time. On submit, 
					the changes made by the first user would be overwritten by the changes made by the second user.
				</p>
				<p>
					Given the small number of people using this application, it is probably unlikely that such a situation would occur. 
					But, since we have not thought of a way to resolve this issue, and as a precaution, please check  
					"recent activities" before making any edits in order to avoid making edits to a case at the same time as another user.
					Additionally, please do <b>keep a copy of your case summary locally (in your computer)</b> in case the abovementioned 
					situation happens.
				</p>
			</div>
			<div className={styles.postContainer}>
				<h5>Slow load times</h5>
				<p>
					You may notice that loading the login page, or logging in may take a disgustingly long amount of time. This is because 
					we are poor and we can't afford paid hosting services. The current free service that we are using sleeps after 30 mins 
					of inactivity in order to save resources. Thus, if you attempt to access the application when it is "sleeping", 
					it has to "wake up" (starting the server, running initialization codes, etc.), which results in a long waiting time. 
					So, just be patient I guess, it shouldn't take more than about 30 secs. :)
				</p>
			</div>
		</div>
	);
}

export default readmePage