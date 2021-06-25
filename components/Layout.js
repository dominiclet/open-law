import Header from './Header'
import styles from '../styles/Layout.module.css'
import NavigationBar from './NavigationBar'

const Layout = (props) => {
    return (
        <>
            <NavigationBar />
            <div className = {styles.container}>
                <main className = {styles.main}>
                    {props.children}
                </main>
            </div>  
        </>
    )
}

export default Layout
