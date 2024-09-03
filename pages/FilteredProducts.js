import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFilteredProductsQuery } from '../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../redux/api/categoryApiSlice';
import Loader from '../components/Loader';
import { Product } from '../components';
import { setCategories, setProducts, setChecked } from '../redux/features/shop/shopSlice';
import { useRouter } from 'next/router';

const FilteredProducts = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);
  const categoriesQuery = useFetchCategoriesQuery();
  const router = useRouter();
  const { category } = router.query;
  const [priceFilter, setPriceFilter] = useState('');

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (category && categories.length) {
      const categoryExists = categories.find((c) => c._id === category);
      if (categoryExists) {
        dispatch(setChecked([category]));
      }
    }
  }, [category, categories, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter((product) => {
          // Check if the product price includes the entered price filter value
          return product.price.toString().includes(priceFilter) || product.price === parseInt(priceFilter, 10);
        });

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  return (
    <div className="filtered-products-main-container">
      <div className="filter-options">
        <div className="filter-option">
          <h6>CATEGORIES</h6>
          {categories?.map((c) => (
            <div key={c._id}>
              <input
                type="checkbox"
                id={`checkbox-${c._id}`}
                onChange={(e) => handleCheck(e.target.checked, c._id)}
                className="checkbox"
                checked={checked.includes(c._id)} // Control checked state
              />
              <label htmlFor={`checkbox-${c._id}`} className="checkbox-label">
                {c.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="filtered-products">
        {products.length === 0 ? (
          <Loader />
        ) : (
          products.map((product) => (
            <div key={product._id}>
              <Product product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FilteredProducts;
