import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import navbarStyles from '../styles/Navbar.module.css';
import CaseSearch from './search/CaseSearch';
import { NavDropdown } from 'react-bootstrap';
import { FileEarmarkPlus, PersonCircle } from 'react-bootstrap-icons';
import Image from 'next/image';

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
            <Navbar.Brand href="/">
                Law Notes
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href='/categories'>Categories</Nav.Link>
                <Nav.Link href="/readme">ReadMe</Nav.Link>
            </Nav>
            <Nav classname="justify-content-end">
                <Nav.Item>
                    <FileEarmarkPlus size="25" className={navbarStyles.addCaseIcon} onClick={props.addCase} />
                </Nav.Item>
                <Nav.Item className={navbarStyles.profileIconContainer}>
                    <PersonCircle 
                        size="25" 
                        className={navbarStyles.profileIcon} 
                        onClick={(event) => {
                            document.getElementById("userIconDropdown").style.display = "block";
                            event.stopPropagation();
                            document.addEventListener('click', () => {
                                let userIcon = document.getElementById("userIconDropdown");
                                if (userIcon) {
                                    document.getElementById("userIconDropdown").style.display = "none";
                                }
                            }, {once: true})
                        }}
                    />
                    <div className={navbarStyles.dropdownContent} id="userIconDropdown" >
                        <a onClick={() => {
                            router.push("/profile/self");
                        }}>Profile</a>
                        <a onClick={() => {router.push("/changepw")}}>Change password</a>
                        <a onClick={handleLogout}>Logout</a>
                    </div>
                </Nav.Item>
            </Nav>
        </Navbar>
    )
}

export default NavigationBar
