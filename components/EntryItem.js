import entryStyles from '../styles/Entry.module.css'
import Link from 'next/link'

const EntryItem = ({entry}) => {
    return (
        <Link href="/case/[id]" as={`/case/${entry._id}`}>
            <a className={entryStyles.card}>
                <h3>{entry.name} &rarr;</h3>
                <p>{entry.tags}</p>
            </a>
        </Link>
    )
}

export default EntryItem
