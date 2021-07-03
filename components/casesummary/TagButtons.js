import Button from 'react-bootstrap/Button'
import Link from 'next/link'
import caseStyle from '../../styles/Case.module.css'

// Props: tags (array of tags either from individual holding or case)
const TagButtons = (props) => {
    return (
        <>
            {props.tag.map((tag) => (
                <Button variant="link" className={caseStyle.tags}>
                    <Link href={`/categories/${tag}`}>{tag}</Link>
                </Button>
            ))}
        </>
    )
}

export default TagButtons
