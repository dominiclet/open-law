import Header from './Header'
import styles from '../styles/Layout.module.css'
<<<<<<< HEAD
import NavBar from './NavBar'
=======
import NavigationBar from './NavigationBar'
>>>>>>> dom

const Layout = (props) => {
    return (
        <>
<<<<<<< HEAD
            <NavBar />
=======
            <NavigationBar />
>>>>>>> dom
            <div className = {styles.container}>
                <main className = {styles.main}>
                    {props.children}
                </main>
          </div>  
        </>
    )
}

export default Layout
