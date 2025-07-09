import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFilteredProductsQuery } from '../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../redux/api/categoryApiSlice';
import Loader from '../components/Loader';
import { Product } from '../components';
import { setCategories, setProducts, setChecked, setPriceRange, resetFilters } from '../redux/features/shop/shopSlice';
import { useRouter } from 'next/router';
import { RiFilter2Line } from "react-icons/ri";
import ErrorCallBack from '@/components/ErrorCallBack';
import { FaFilter } from "react-icons/fa";

const FilteredProductsFemale = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, priceRange } = useSelector((state) => state.shop);
  const categoriesQuery = useFetchCategoriesQuery();
  const router = useRouter();
  const { category } = router.query;
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch filtered products based on checked categories and price range
  const { data: filteredProductsQuery, isLoading: isFilteredProductsLoading, isError: isFilteredProductsError, isSuccess: isFilteredProductsSuccess } = useGetFilteredProductsQuery({ checked, radio: priceRange, gender: 'female' });

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
     if (isFilteredProductsSuccess && filteredProductsQuery) {
       dispatch(setProducts(filteredProductsQuery));
     }
   }, [checked, priceRange, filteredProductsQuery, isFilteredProductsSuccess, dispatch]);

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handlePriceChange = (range) => {
    dispatch(setPriceRange(range));
  };

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(setPriceRange([]));
  };

  if (categoriesQuery.isLoading || isFilteredProductsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </div>
    )
  }

  if (categoriesQuery.isError || isFilteredProductsError) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ErrorCallBack message={categoriesQuery.isError?.data?.message || isFilteredProductsError?.data?.message} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="filtered-products-main-container">
      <div className="filter-options-desktop">
        <div className="filter-option">
          <h6>CATEGORIES</h6>
          {categories?.map((c) => (
            <div className='filter-option-row' key={c._id}>
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
          <div className='filter-option-row'>
            <input type="checkbox" name="price" checked={JSON.stringify(priceRange) === JSON.stringify([699, 899])} onChange={() => JSON.stringify(priceRange) === JSON.stringify([699, 899])
              ? handlePriceChange([])
              : handlePriceChange([699, 899])} />
            <label className='price-input-label'>Rs. 699 - Rs. 899</label>
          </div>
          <div className='filter-option-row'>
            <input type="checkbox" name="price" checked={JSON.stringify(priceRange) === JSON.stringify([899, 1099])} onChange={() => JSON.stringify(priceRange) === JSON.stringify([899, 1099])
              ? handlePriceChange([])
              : handlePriceChange([899, 1099])} />
            <label className='price-input-label'>Rs. 899 - Rs. 1099</label>
          </div>
          <div className='filter-option-row'>
            <input type="checkbox" name="price" checked={JSON.stringify(priceRange) === JSON.stringify([1099, 1299])} onChange={() => JSON.stringify(priceRange) === JSON.stringify([1099, 1299])
              ? handlePriceChange([])
              : handlePriceChange([1099, 1299])} />
            <label className='price-input-label'>Rs. 1099 - Rs. 1299</label>
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
          <div className="centered-container">
            <div className="status-box empty-box">
              <FaFilter size={90} className="status-icon empty-icon" />
              <h2>No Products Found</h2>
              <p>Try adjusting your filters to see more items.</p>
            </div>
          </div>
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
        {/* <button onClick={() => setFilterOpen(false)} className='hamburger-menu-links-close-btn'><IoClose /></button> */}
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
              <input type="checkbox" name="price" checked={JSON.stringify(priceRange) === JSON.stringify([699, 899])} onChange={() => JSON.stringify(priceRange) === JSON.stringify([699, 899])
                ? handlePriceChange([])
                : handlePriceChange([699, 899])} />
              <label className='price-input-label'>Rs. 699 - Rs. 899</label>
            </div>
            <div>
              <input type="checkbox" name="price" checked={JSON.stringify(priceRange) === JSON.stringify([899, 1099])} onChange={() => JSON.stringify(priceRange) === JSON.stringify([899, 1099])
                ? handlePriceChange([])
                : handlePriceChange([899, 1099])} />
              <label className='price-input-label'>Rs. 899 - Rs. 1099</label>
            </div>
            <div>
              <input type="checkbox" name="price" checked={JSON.stringify(priceRange) === JSON.stringify([1099, 1299])} onChange={() => JSON.stringify(priceRange) === JSON.stringify([1099, 1299])
                ? handlePriceChange([])
                : handlePriceChange([1099, 1299])} />
              <label className='price-input-label'>Rs. 1099 - Rs. 1299</label>
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
