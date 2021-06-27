import categoriesStyle from '../../styles/Categories.module.css'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { ArrowRight } from 'react-bootstrap-icons'
import Link from 'next/link'
import axios from 'axios'
import apiRoot from '../../config'

const Item = (props) => {
    return (
        <div>
            <Table striped bordered hover className = {categoriesStyle.body}>
                <thead>
                    <td colSpan = "2">
                        {props.tag}
                        <Link href = '/categories/[tag]' as={`/categories/${props.tag}`}>
                            <Button className = {categoriesStyle.button}>
                                Load More
                                <ArrowRight/>
                            </Button>
                        </Link>
                    </td>
                </thead>
                <thead>
                    <tr>
                        <th>Case</th>
                        <th>Last Edited</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>case name</td>
                        <td>last edited</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

/*
export async function getStaticPaths() {
    const res = await axios.get(apiRoot + `/categories`)
    const categories = res.data
    const paths = categories.map(category => ({params: {tag: category.toString()}}))
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({params}) {
  const res = await axios.get(apiRoot + `/casesTag/${params.tag}/3`);
  const data = res.data;
  return {
    props: { data }
  }
}
/*
                    {data.map((entry) => (
                        <tr>
                            <td>{entry.case_name}</td>
                            <td>{entry.time}</td>
                        </tr>
                    ))}
*/
export default Item
