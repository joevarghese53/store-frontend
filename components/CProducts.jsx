import React, { useState } from 'react'
import { useGetCProductsQuery } from '../redux/api/cProductApiSlice'
import { useAddToCartMutation } from '../redux/api/cartApiSlice'
import { useDeleteCProductMutation } from '../redux/api/cProductApiSlice'
import { toast } from 'react-toastify'
import Loader from './Loader'
import CProduct  from '../components/CProduct';
import SizeSelectorPopUp from './SizeSelectorPopUp'


const Cproducts = () => {

  const { data, isLoading, error } = useGetCProductsQuery();
  console.log(data);
  const [addToCart] = useAddToCartMutation();
  const [DeleteCProduct] = useDeleteCProductMutation();
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = async (product_id, size) => {
    try {
      console.log(`Adding product to cart: productId=${product_id}, quantity= 1, size=${size}`);
      await addToCart({ productId: product_id, quantity: 1, productType: 'cProduct', size: size }).unwrap();
      toast.success(`Item Moved to cart successfully.`);
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const handleDeleteCProduct = async (product_id) => {
    try {
      console.log(`Deleting custom product: productId=${product_id}`);
      await DeleteCProduct(product_id).unwrap();
      toast.success(`Custom Product deleted successfully`);
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  }

  const handleMoveToCartClick = (product) => {
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
        <h1 style={{ height: '200px', paddingTop: '100px', minHeight: '50vh', alignContent: 'center' }}>No Products Made So Far😢</h1>
      </div>
    );
  }

  return (
    <div className="cproducts-main-container">
            {data.customProducts.map((product) => (
                <div key={product._id} className='cproduct-item'>
                    <CProduct product={product} />
                    <button className="wishlist-movetocart-button" onClick={() => handleMoveToCartClick(product)}>Add to Cart</button>
                    {/* <button className="wishlist-remove-button" onClick={() => handleDeleteCProduct(product._id)}>Delete</button> */}
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