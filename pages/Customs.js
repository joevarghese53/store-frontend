import React, { useState } from 'react';
import Workshop  from '@/components/Workshop';
import CProducts from '@/components/CProducts';

const Customs = () => {

  const [activeTab, setActiveTab] = useState('Workshop');

  const renderComponent = () => {
    switch (activeTab) {
      case 'Workshop':
        return <Workshop  setActiveTab={setActiveTab} />;
      case 'CProducts':
        return <CProducts />;
      default:
        return <Workshop  setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className='customs-main-container'>
      <div className="customs-tabs">
        <button 
          className={`customs-tab ${activeTab === 'Workshop' ? 'active' : ''}`}
          onClick={() => setActiveTab('Workshop')}
        >
          WORKSHOP
        </button>
        <button 
          className={`customs-tab ${activeTab === 'CProducts' ? 'active' : ''}`}
          onClick={() => setActiveTab('CProducts')}
        >
          PRODUCTS
        </button>
      </div>

      <div className="customs-content">
        {renderComponent()}
      </div>

    </div>
  );
};


export default Customs;
