import React from 'react'
import Link from 'next/link'

const oversized = '/img/oversized.jpg';
const regular = '/img/regular.jpg';
const hoodie = '/img/hoodie.jpg';
const Categories = () => {
    return (
        <div className='categories'>
            <Link href={'/OverSized'} >
                <div className="category-card">
                    <img
                        src={oversized}
                        className="category-image"
                    />
                    <h1 className="category-title">OVERSIZED T-SHIRTS</h1>
                </div>
            </Link>
            <Link href={'/Regular'} >
                <div className="category-card">
                    <img
                        src={regular}
                        className="category-image"
                    />

                    <h1 className="category-title">REGULAR T-SHIRTS</h1>
                </div>
            </Link>
            <Link href={'/Hoodie'} >
                <div className="category-card">
                    <img
                        src={hoodie}
                        className="category-image"
                    />
                    <h1 className='category-title'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HOODIES</h1>
                </div>
            </Link>
        </div>
    )
}

export default Categories