import categoriesStyle from '../../styles/Categories.module.css'
import Item from '../../components/categories/Item'
import { apiRoot } from '../../config'
import axios from 'axios'
import { useEffect, useState } from 'react'

const categories = (props) => {
  // State to store data
  const [data, setData] = useState();

  useEffect(() => {
    axios.get(apiRoot + '/categories')
      .then(res => {
        setData(res.data);
      });
  }, []);


  if (data) {
    return (
        <div>
            <h1 className={categoriesStyle.header}>Categories</h1>
            {data.map( (entry) => (
                <Item key = {entry[0]} tag = {entry[0]} count = {entry[1]}/>
            ))}
        </div>
    );
  } else {
    return (
      <div>
        <h1 className={categoriesStyle.header}>Categories</h1>
        Loading...
      </div>
    );
  }
}

export default categories
