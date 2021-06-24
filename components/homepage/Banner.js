import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'

const Banner = () => {
    return (
        <Jumbotron>
            <h1>Title</h1>
            <p>description</p>
            <p>
                <Button variant="primary">Sign Up</Button>
                <Button variant="primary">Sign In</Button>
            </p>
        </Jumbotron>
    )
}

export default Banner
