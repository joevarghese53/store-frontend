import React, { useState } from 'react';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';

const CreateProduct = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [offers, setOffers] = useState("");
  const [returnpolicy, setReturnPolicy] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const router = useRouter();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("brand", brand);
      productData.append("offers", offers);
      productData.append("returnpolicy", returnpolicy);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Try again.");
        console.log("Product creation failed. Try again.");
        console.log("Error: ", data.error);
      } else {
        toast.success(`${data.name} is created`);
        router.push('/');
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(URL.createObjectURL(file));
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="create-product-container">
      <h2 className="create-product-heading">Create Product</h2>

      {imageUrl && (
        <div className="create-product-image">
          <img
            src={imageUrl}
            alt="product"
          />
        </div>
      )}

      <div className="create-product-image-upload">
        <label>
          Upload Image
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={uploadFileHandler}
          />
        </label>
      </div>

      <div className="create-product-details">
        <div className="create-product-details-row1">
          <div className="create-product-details-name">
            <label htmlFor="name">Name</label> <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="create-product-details-price">
            <label htmlFor="price">Price</label> <br />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="create-product-details-row2">
          
          <div className="create-product-details-brand">
            <label htmlFor="brand">Brand</label> <br />
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
        </div>
        <div className="create-product-details-row3">
          <div className="create-product-details-offers">
            <label htmlFor="offers">Offers</label> <br />
            <input
              type="text"
              value={offers}
              onChange={(e) => setOffers(e.target.value)}
            />
          </div>
          <div className="create-product-details-returnpolicy">
            <label htmlFor="returnpolicy">Return Policy</label> <br />
            <input
              type="text"
              value={returnpolicy}
              onChange={(e) => setReturnPolicy(e.target.value)}
            />
          </div>
        </div>
        <div className="create-product-details-description">
          <label>
            Description
          </label>
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="create-product-details-row4">
          <div className="create-product-details-count">
            <label htmlFor="stock">Count In Stock</label> <br />
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div className="create-product-details-category">
            <label htmlFor="category">Category</label> <br />
            <select
              placeholder="Choose Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button id='create-product-submit'
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateProduct;
