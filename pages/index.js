import React from 'react';
import { HeroBanner } from '../components';
import BestSellers from '../components/BestSellers';
import Categories from '../components/Categories';

const Home = () => {
  return (
    <div>

      <HeroBanner />

      <div className="products-heading">
        <h2>BEST SELLERS</h2>
      </div>
      <BestSellers />
      
      <div className="categories-heading">
        <h2>CATEGORIES</h2>
      </div>
      <Categories />

    </div>
  );
};


export default Home;