import EntryItem from './EntryItem'
import entryStyles from '../styles/Entry.module.css'

const EntryList = ({entries}) => {
    return (
        <div className={entryStyles.grid}>
            {entries.map( (entry) => (
                <EntryItem entry = {entry} />
            ))}
        </div>
    )
}

export default EntryList
