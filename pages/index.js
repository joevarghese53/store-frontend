import React from 'react';
import { HeroBanner } from '../components';
import BestSellers from '../components/BestSellers';

const Home = () => {
  return (
    <div>
      <HeroBanner />
      <div className="products-heading">
        <h2>Best Seller Products</h2>
      </div>

      <BestSellers />

    </div>
  );
};


export default Home;