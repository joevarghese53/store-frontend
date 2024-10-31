import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFilteredProductsQuery } from '../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../redux/api/categoryApiSlice';
import Loader from '../components/Loader';
import { Product } from '../components';
import { setCategories, setProducts, setChecked, setPriceRange, resetFilters } from '../redux/features/shop/shopSlice';
import { useRouter } from 'next/router';
import { RiFilter2Line } from "react-icons/ri";

const FilteredProductsFemale = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, priceRange } = useSelector((state) => state.shop);
  const categoriesQuery = useFetchCategoriesQuery();
  const router = useRouter();
  const { category } = router.query;
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch filtered products based on checked categories and price range
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio: priceRange, gender: 'female' });

  useEffect(() => {
    // Dispatch categories when fetched
    if (categoriesQuery.isSuccess && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isSuccess, dispatch]);

  useEffect(() => {
    // Check if category exists and set as checked if it does
    if (category && categories.length) {
      const categoryExists = categories.find((c) => c._id === category);
      if (categoryExists) {
        dispatch(setChecked([category]));
      }
    }
  }, [category, categories, dispatch]);

  useEffect(() => {
    // Fetch and set products when checked categories or price range change
    if (filteredProductsQuery.isSuccess && filteredProductsQuery.data) {
      dispatch(setProducts(filteredProductsQuery.data));
    }
  }, [checked, priceRange, filteredProductsQuery.data, filteredProductsQuery.isSuccess, dispatch]);

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handlePriceChange = (range) => {
    dispatch(setPriceRange(range));
  };
  
  const handleReset = () => {
    dispatch(resetFilters());
  };

  if (categoriesQuery.isLoading || filteredProductsQuery.isLoading) {
    return <Loader />;
  }

  return (
    <div className="filtered-products-main-container">
      <div className="filter-options-desktop">
        <div className="filter-option">
          <h6>CATEGORIES</h6>
          {categories?.map((c) => (
            <div key={c._id}>
              <input
                type="checkbox"
                id={`checkbox-${c._id}`}
                onChange={(e) => handleCheck(e.target.checked, c._id)}
                className="checkbox"
                checked={checked.includes(c._id)}
              />
              <label htmlFor={`checkbox-${c._id}`} className="checkbox-label">
                {c.name}
              </label>
            </div>
          ))}
        </div>
        <div className="filter-option">
          <h6>PRICE RANGE</h6>
          <div>
            <input type="radio" name="price" onChange={() => handlePriceChange([500, 600])} /> 500-600
          </div>
          <div>
            <input type="radio" name="price" onChange={() => handlePriceChange([600, 700])} /> 600-700
          </div>
          <div>
            <input type="radio" name="price" onChange={() => handlePriceChange([700, 800])} /> 700-800
          </div>
        </div>
        <div className="filter-option">
          <div
            className="filter-reset-btn"
            onClick={handleReset}
          >
            Clear All
          </div>
        </div>
      </div>
      <div className="filtered-products">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => (
            <div key={product._id}>
              <Product product={product} />
            </div>
          ))
        )}
      </div>
      <div className="filter-options-mobile" onClick={() => setFilterOpen(true)}>
        <RiFilter2Line size={24} />
        <h4>FILTER</h4>
      </div>
      <div className={`filter-menu-mobile ${filterOpen ? 'open' : ''}`} >
        {/* <button onClick={() => setFilterOpen(false)} className='close-btn'><IoClose /></button> */}
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
                  checked={checked.includes(c._id)}
                />
                <label htmlFor={`checkbox-${c._id}`} className="checkbox-label">
                  {c.name}
                </label>
              </div>
            ))}
          </div>
          <div className="filter-option">
            <h6>PRICE RANGE</h6>
            <div>
              <input type="radio" name="price" onChange={() => handlePriceChange([500, 600])} /> 500-600
            </div>
            <div>
              <input type="radio" name="price" onChange={() => handlePriceChange([600, 700])} /> 600-700
            </div>
            <div>
              <input type="radio" name="price" onChange={() => handlePriceChange([700, 800])} /> 700-800
            </div>
          </div>

          <div className="filter-option">
            <div
              className="filter-reset-btn"
              onClick={handleReset}
            >
              Clear All
            </div>
          </div>
        </div>
        <div className="filter-menu-bottom-buttons">
          {/* <button onClick={() => setFilterOpen(false)} className='reset-btn'>Close</button> */}
          <button onClick={() => setFilterOpen(false)} className='apply-btn'>APPLY</button>
        </div>
      </div>
    </div>
  );
};

export default FilteredProductsFemale;
