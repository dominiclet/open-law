import entryStyles from '../../styles/Entry.module.css'
import Link from 'next/link'

// Props: entry (case information)
const EntryItem = (props) => {
    return (
        <Link href="/case/[id]" as={`/case/${props.entry._id}`}>
            <a className={entryStyles.card}>
                <h3>{props.entry.name} &rarr;</h3>
                <p>{props.entry.tags}</p>
            </a>
        </Link>
    )
}

export default EntryItem
