import React from 'react';
import { HeroBanner } from '../components';
import BestSellers from '../components/BestSellers';
import Categories from '../components/Categories';

const Women = () => {
  return (
    <div>
      <HeroBanner />
      <div className="products-heading">
        <h2>BEST RATED</h2>
      </div>

      <BestSellers gender="female" />
      <div className="categories-heading">
        <h2>CATEGORIES</h2>
      </div>
      <Categories gender="female"/>

    </div>
  );
};


export default Women;