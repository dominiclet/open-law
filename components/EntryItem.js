import entryStyles from '../styles/Entry.module.css'
import Link from 'next/link'

const EntryItem = ({entry}) => {
    return (
        <Link href="/case/[id]" as={`/case/${entry.id}`}>
            <a className={entryStyles.card}>
                <h3>{entry.title} &rarr;</h3>
                <p>{entry.body}</p>
            </a>
        </Link>
    )
}

export default EntryItem
