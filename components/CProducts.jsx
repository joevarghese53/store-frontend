import React from 'react'
import { useGetCProductsQuery } from '../redux/api/cProductApiSlice'
import { useAddToCartMutation } from '../redux/api/cartApiSlice'
import { useDeleteCProductMutation } from '../redux/api/cProductApiSlice'
import { toast } from 'react-toastify'
import Loader from './Loader'
import CProduct  from '../components/CProduct';


const Cproducts = () => {

  const { data, isLoading, error } = useGetCProductsQuery();
  console.log(data);
  const [addToCart] = useAddToCartMutation();
  const [DeleteCProduct] = useDeleteCProductMutation();

  const handleAddToCart = async (product_id) => {
    try {
      console.log(`Adding product to cart: productId=${product_id}, quantity= 1`);
      await addToCart({ productId: product_id, quantity: 1, productType: 'cProduct' }).unwrap();
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
        <h1 style={{ height: '200px', paddingTop: '100px' }}>ERROR</h1>
      </div>
    );
  }

  return (
    <div className="cproducts-main-container">
            {data.customProducts.map((product) => (
                <div key={product._id} className='cproduct-item'>
                    <CProduct product={product} />
                    <button className="wishlist-movetocart-button" onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
                    {/* <button className="wishlist-remove-button" onClick={() => handleDeleteCProduct(product._id)}>Delete</button> */}
                </div>
            ))}
        </div>
    );
};


export default Cproducts