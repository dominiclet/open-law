import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import navbarStyles from '../styles/Navbar.module.css';
import CaseSearch from './search/CaseSearch';

const NavigationBar = (props) => {
    const router = useRouter();
    
    // Logout functionality
    const handleLogout = () => {
        localStorage.removeItem("jwt-token");
        router.push("/login");
    };

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Brand href="/">Lawmology</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href='/categories'>Categories</Nav.Link>
                <Nav.Link href='/about'>About</Nav.Link>
            </Nav>
            <Nav classname="justify-content-end">
                <Nav.Item className={navbarStyles.navSearchContainer}>
                    <CaseSearch />
                </Nav.Item>
                <Nav.Item className={navbarStyles.button}>
                    <Button variant="light" onClick={props.addCase}>Add case</Button>
                </Nav.Item>
                <Nav.Item className={navbarStyles.button}>
                    <Button variant="light" onClick={handleLogout}>Logout</Button>
                </Nav.Item>
            </Nav>
        </Navbar>
    )
}

export default NavigationBar
