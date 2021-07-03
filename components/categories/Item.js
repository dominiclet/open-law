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

export default Item
