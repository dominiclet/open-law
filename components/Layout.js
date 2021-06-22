import Header from './Header'
import styles from '../styles/Layout.module.css'
import NavigationBar from './NavigationBar'

const Layout = ({children}) => {
    return (
        <>
            <NavigationBar />
            <div className = {styles.container}>
                <main className = {styles.main}>
                    {children}
                </main>
          </div>  
        </>
    )
}

export default Layout
