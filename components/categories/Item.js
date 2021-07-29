import categoriesStyle from '../../styles/Categories.module.css'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { ArrowRight } from 'react-bootstrap-icons'
import Link from 'next/link'
import axios from 'axios'
import apiRoot from '../../config'

const Item = (props) => {
    return (
        <div className = {categoriesStyle.card}>
            <div className = {categoriesStyle.outerContainer}>
                <div className = {categoriesStyle.innerContainer}>
                    <p className = {categoriesStyle.cardHeader}>{props.tag}</p>
                    <p className = {categoriesStyle.cardWords}>{props.count} case(s) in this category</p>
                </div>                    
                <Link href = '/category/[tag]' as={`/category/${props.tag}`}>
                    <Button variant='secondary' size='sm' className = {categoriesStyle.button}>
                        Load More
                        <ArrowRight/>
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default Item