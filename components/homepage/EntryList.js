import EntryItem from './EntryItem'
import entryStyles from '../../styles/Entry.module.css'

// Props: entries
const EntryList = (props) => {
    return (
        <div className={entryStyles.grid}>
            {props.entries.map( (entry) => (
                <EntryItem entry = {entry} key = {entry._id}/>
            ))}
        </div>
    )
}

export default EntryList
