import Link from 'next/link';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const NavigationBar = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Brand href="/">Lawmology</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href='/categories'>Categories</Nav.Link>
                <Nav.Link href='/about'>About</Nav.Link>
            </Nav>
            <Form inline>
                <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-primary">Search</Button>
            </Form>

        </Navbar>
    )
}

export default NavigationBar
