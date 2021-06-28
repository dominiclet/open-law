import Link from 'next/link';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

const NavigationBar = (props) => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Brand href="/">Lawmology</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href='/categories'>Categories</Nav.Link>
                <Nav.Link href='/about'>About</Nav.Link>
            </Nav>
            <Nav classname="justify-content-end">
                <Nav.Item>
                    <Button onClick={props.addCase}>Add case</Button>
                </Nav.Item>
            </Nav>
        </Navbar>
    )
}

export default NavigationBar
