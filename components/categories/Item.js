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
                        <Link href = '/category/[tag]' as={`/category/${props.tag}`}>
                            <Button className = {categoriesStyle.button}>
                                Load More
                                <ArrowRight/>
                            </Button>
                        </Link>
                    </td>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.count} cases in this category</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default Item
