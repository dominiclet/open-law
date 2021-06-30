import styles from '../styles/Layout.module.css';

const LoginLayout = (props) => {

	return (
		<div className={styles.container}>
			<main className = {styles.main}>
				{props.children}
			</main>
		</div>
	);
}

export default LoginLayout