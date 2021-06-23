import Link from 'next/link';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const NavigationBar = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Brand href="/">Lawmology</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link>Categories</Nav.Link>
                <Nav.Link>About</Nav.Link>
            </Nav>
        </Navbar>
    )
}

export default NavigationBar
