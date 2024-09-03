


const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };
  
  <div className='filter-option'>
  <h6>PRICE RANGE</h6>
  <div>
  <input
    type="checkbox"
    id="red-checkbox"
    onChange={(e) => handleCheck(e.target.checked, c._id)}
    className='checkbox'
  />
  <label
    htmlFor="pink-checkbox"
    className='checkbox-label'
  >
    Rs. 500 - Rs. 600
  </label>
  </div>
  <div>
  <input
    type="checkbox"
    id="red-checkbox"
    onChange={(e) => handleCheck(e.target.checked, c._id)}
    className='checkbox'
  />
  <label
    htmlFor="pink-checkbox"
    className='checkbox-label'
  >
    Rs. 600 - Rs. 700
  </label>
  </div>
  <div>
  <input
    type="checkbox"
    id="red-checkbox"
    onChange={(e) => handleCheck(e.target.checked, c._id)}
    className='checkbox'
  />
  <label
    htmlFor="pink-checkbox"
    className='checkbox-label'
  >
    Rs. 700 - Rs. 800
  </label>
  </div>
</div>  