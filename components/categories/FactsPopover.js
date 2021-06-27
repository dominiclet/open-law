import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Button from'react-bootstrap/Button'

const popover = (
    <Popover id="popover-basic">
        <Popover.Title as="h3">Popover</Popover.Title>
        <Popover.Content>Test Content</Popover.Content>
    </Popover>
)

const FactsPopover = (props) => {
    return (
        <OverlayTrigger trigger="click" placement="right" overlay={popover}>
            <Button variant = "success">Click here</Button>
        </OverlayTrigger>
    )
}

export default FactsPopover
