import Link from 'next/link'
import navStyles from '../styles/Nav.module.css'
import Header from './Header'
// Bootstrap
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from'react-bootstrap/Button'

const NavBar = () => {
    return (
        <Navbar bg='dark' variant='dark'>
            <Navbar.Brand href='/'>
                <Header/>
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href='/topics'>Topics</Nav.Link>
                <Nav.Link href='/about/'>About</Nav.Link>
            </Nav>
            <Form inline>
                <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-primary">Search</Button>
            </Form>
        </Navbar>
    )
}

export default NavBar
