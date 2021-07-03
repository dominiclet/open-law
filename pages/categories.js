import categoriesStyle from '../styles/Categories.module.css'
import Item from '../components/categories/Item'
import { apiRoot } from '../config'
import axios from 'axios'

const categories = (props) => {
    return (
        <div>
            <h1 className={categoriesStyle.header}>Categories</h1>
            {props.entries.map( (entry) => (
                <Item key = {entry} tag = {entry}/>
            ))}
        </div>
    )
}

export const getStaticProps = async() => {
  const res = await axios.get(apiRoot + '/categories')
  const entries = res.data
  return {
    props: {
      entries
    }
  }
}

export default categories
