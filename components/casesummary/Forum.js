import ForumPost from './ForumPost'

// Props: forum posts from each case
const Forum = (props) => {
    return (
        <div>
            {props.posts.map( (post) => (
                <ForumPost post = {post}/>
            ))}
        </div>

    )
}

export default Forum
