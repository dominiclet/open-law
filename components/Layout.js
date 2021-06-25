import Header from './Header'
import styles from '../styles/Layout.module.css'
import NavBar from './NavBar'

const Layout = (props) => {
    return (
        <>
            <NavBar />
            <div className = {styles.container}>
                <main className = {styles.main}>
                    {props.children}
                </main>
          </div>  
        </>
    )
}

export default Layout
