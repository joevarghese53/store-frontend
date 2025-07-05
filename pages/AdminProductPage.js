import React from 'react'
import Link from 'next/link'
import styles from '../styles/AdminProductPage.module.css';
import { FaPlus, FaEdit } from 'react-icons/fa';

const AdminProductPage = () => {
  return (
    <div className={styles['admin-product-bg']}>
      <div className={styles['admin-product-card']}>
        <h2 className={styles['admin-product-title']}>Product Management</h2>
        <div className={styles['admin-product-actions']}>
          <Link href="/CreateProduct" className={styles['admin-product-action']}>
            <FaPlus className={styles['admin-product-icon']} />
            <span>Create Product</span>
          </Link>
          <Link href="/ProductList" className={styles['admin-product-action']}>
            <FaEdit className={styles['admin-product-icon']} />
            <span>Update / Delete Product</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminProductPage