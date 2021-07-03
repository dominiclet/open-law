import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Link from 'next/link'
import forumStyle from '../../styles/Forum.module.css'
import { HandThumbsDown } from 'react-bootstrap-icons'
import { HandThumbsUp } from 'react-bootstrap-icons'

// Props: individual forum post
const ForumPost = (props) => {
    const date = new Date(props.post.timestamp);
    return (
        <div>
            <Card className={forumStyle.container}>
                <p className={forumStyle.votes}>
                    <Button><HandThumbsUp/></Button>
                    <br/>
                    +{props.post.upvotes}
                    <br/>
                    &nbsp;-{props.post.downvotes}
                    <br/>
                    <Button variant="secondary"><HandThumbsDown/></Button>
                </p>
                <p className={forumStyle.text}>
                    <a className={forumStyle.user} href='/user'>
                        @{props.post.user}
                        &ensp;{date.toLocaleTimeString("en-SG")} on {date.toLocaleDateString("en-SG")}
                    </a>
                    <br/>
                    <h3>{props.post.title}</h3>
                    {props.post.body}
                </p>
            </Card>
        </div>
    )
}

export default ForumPost
