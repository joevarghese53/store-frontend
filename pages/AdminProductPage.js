import React from 'react'
import Link from 'next/link'

const AdminProductPage = () => {
  return (
    <div className='admin-product-page-main-container'>
        <div className='admin-product-page-create'>
        <Link href="/CreateProduct">CREATE<br></br> PRODUCT</Link>
        </div>
        <div className='admin-product-page-update'>
        <Link href="/ProductList">UPDATE/<br></br>DELETE<br></br> PRODUCT</Link>
        </div>
    </div>
  )
}

export default AdminProductPage