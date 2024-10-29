import React, { useState, useEffect } from 'react'
import { useGetCProductsQuery } from '../redux/api/cProductApiSlice'
import { useAddToCartMutation, useRemoveAllOfProductFromCartMutation } from '../redux/api/cartApiSlice'
import { useRemoveFromWishlistMutation } from '../redux/api/wishlistApiSlice'
import { useDeleteCProductMutation } from '../redux/api/cProductApiSlice'
import { toast } from 'react-toastify'
import Loader from './Loader'
import CProduct  from '../components/CProduct';
import SizeSelectorPopUp from './SizeSelectorPopUp'


const Cproducts = () => {

  const { data, isLoading, error } = useGetCProductsQuery();
  const [addToCart] = useAddToCartMutation();
  const [deleteCProduct] = useDeleteCProductMutation();
  const [removeAllOfProductFromCart] = useRemoveAllOfProductFromCartMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  
  const handleAddToCart = async (product_id, size) => {
    try {
      console.log(`Adding product to cart: productId=${product_id}, quantity= 1, size=${size}`);
      await addToCart({ productId: product_id, quantity: 1, productType: 'cProduct', size: size }).unwrap();
      toast.success(`Item Added to cart successfully.`);
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const handleDeleteCProduct = async (product_id) => {
    try {
      const removeFromCartResponse =  await removeAllOfProductFromCart({productId: product_id}).unwrap(); 
      if(removeFromCartResponse.success) {
        console.log(`Deleting custom product: productId=${product_id}`);
        await deleteCProduct(product_id).unwrap();
        toast.success(`Custom Product deleted successfully`);
      }
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  }

  const handleAddToCartClick = (product) => {
    setSelectedProduct(product); // Set the selected product
    setShowSizeModal(true); // Show the size selection modal
};

  if (isLoading) {
    return (
      <div className="best-sellers">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="best-sellers">
        <h1 style={{ height: '200px', paddingTop: '100px' }}>No Products Designed</h1>
      </div>
    );
  }

  return (
    <div className="cproducts-main-container">
            {data.customProducts.length === 0 && (  
                <h1 style={{ height: '200px', paddingTop: '100px' }}>No Products Designed</h1>
            )}
            {data.customProducts.map((product) => (
                <div key={product._id} className='cproduct-item'>
                    <CProduct product={product} />
                    <button className="wishlist-movetocart-button" onClick={() => handleAddToCartClick(product)}>Add to Cart</button>
                    <button className="wishlist-remove-button" onClick={() => handleDeleteCProduct(product._id)}>Delete</button>
                </div>
            ))}
            {selectedProduct && (
                <SizeSelectorPopUp
                    show={showSizeModal}
                    onClose={() => setShowSizeModal(false)}
                    onConfirm={handleAddToCart}
                    product={selectedProduct}
                />
            )}
        </div>
    );
};


export default Cproducts