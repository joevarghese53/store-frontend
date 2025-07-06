// CreateProduct.js
import React, { useState } from 'react';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';

const CreateProduct = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontDesign, setFrontDesign] = useState(null);
  const [backDesign, setBackDesign] = useState(null);
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("66adfb21a1698be6bdfa8e59");
  const [gender, setGender] = useState(""); // Initialize state for gender
  const [offers, setOffers] = useState("");
  const [returnpolicy, setReturnPolicy] = useState("");
  const [stock, setStock] = useState(0);
  const [frontImageUrlToDisplay, setFrontImageUrlToDisplay] = useState(null);
  const [backImageUrlToDisplay, setBackImageUrlToDisplay] = useState(null);
  const [frontDesignUrlToDisplay, setFrontDesignUrlToDisplay] = useState(null);
  const [backDesignUrlToDisplay, setBackDesignUrlToDisplay] = useState(null);
  const [imagesUrlToDisplay, setImagesUrlToDisplay] = useState([]);
  const router = useRouter();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const formData = new FormData();
      formData.append("frontImage", frontImage);
      formData.append("backImage", backImage);
      formData.append("frontDesign", frontDesign);
      formData.append("backDesign", backDesign);
      if (images.length) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }
      const res = await uploadProductImage(formData).unwrap();

      const productData = new FormData();
      productData.append("frontImage", res.imageUrls.frontImage[0]);
      productData.append("backImage", res.imageUrls.backImage[0]);
      productData.append("frontDesign", res.imageUrls.frontDesign[0]);
      productData.append("backDesign", res.imageUrls.backDesign[0]);
      if (res.imageUrls?.images?.length) {
        productData.append("images", JSON.stringify(res.imageUrls.images));
      }
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("gender", gender);
      productData.append("offers", offers);
      productData.append("returnpolicy", returnpolicy);
      productData.append("countInStock", stock);

      console.log("productData");
      for (let [key, value] of productData.entries()) {
        console.log(`${key}:`, value);
      }

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Try again.");
        console.log("Product creation failed. Try again.");
        console.log("Error: ", data.error);
        setIsLoading(false);
      } else {
        toast.success(`${data.name} is created`);
        router.push('/');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try again.");
      setIsLoading(false);
    }
  };

  const uploadFrontImageHandler = async (e) => {
    const file = e.target.files[0];
    setFrontImage(file);
    setFrontImageUrlToDisplay(URL.createObjectURL(file));
  };

  const uploadBackImageHandler = async (e) => {
    const file = e.target.files[0];
    setBackImage(file);
    setBackImageUrlToDisplay(URL.createObjectURL(file));
  };

  const uploadFrontDesignHandler = async (e) => {
    const file = e.target.files[0];
    setFrontDesign(file);
    setFrontDesignUrlToDisplay(URL.createObjectURL(file));
  };

  const uploadBackDesignHandler = async (e) => {
    const file = e.target.files[0];
    setBackDesign(file);
    setBackDesignUrlToDisplay(URL.createObjectURL(file));
  };

  const uploadImagesHandler = async (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImagesUrlToDisplay((prevImages) => [...prevImages, ...urls]);
  };



  return (
    <div className="create-product-container">
      <h2 className="create-product-heading">Create Product</h2>
      <div className="create-product-images-display">
        {frontImageUrlToDisplay && (
          <div className="create-product-image">
            <img
              src={frontImageUrlToDisplay}
              alt="product"
            />
            <p>FRONT IMAGE</p>
          </div>
        )}
        {backImageUrlToDisplay && (
          <div className="create-product-image">
            <img
              src={backImageUrlToDisplay}
              alt="product"
            />
            <p>BACK IMAGE</p>
          </div>
        )}
        {frontDesignUrlToDisplay && (
          <div className="create-product-image">
            <img
              src={frontDesignUrlToDisplay}
              alt="product"
            />
            <p>FRONT DESIGN</p>
          </div>
        )}
        {backDesignUrlToDisplay && (
          <div className="create-product-image">
            <img
              src={backDesignUrlToDisplay}
              alt="product"
            />
            <p>BACK DESIGN</p>
          </div>
        )}
        {imagesUrlToDisplay.map((url, index) => (
          <div key={index} className="create-product-image">
            <img
              src={url}
              alt="product"
            />
            <p>IMAGE {index + 1}</p>
          </div>
        ))}
      </div>

      <div className="create-product-image-upload">
        <label>
          Front Image
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={uploadFrontImageHandler}
          />
        </label>
        <label>
          Back Image
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={uploadBackImageHandler}
          />
        </label>
        <label>
          Front Design
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={uploadFrontDesignHandler}
          />
        </label>
        <label>
          Back Design
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={uploadBackDesignHandler}
          />
        </label>
        <label>
          Images
          <input
            type="file"
            name="image"
            accept="image/*"
            multiple
            onChange={uploadImagesHandler}
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

          <div className="create-product-details-gender">
            <label htmlFor="gender">Gender</label> <br />
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option> {/* Placeholder option */}
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
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
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#ccc' : '#ed2e30',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}

        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateProduct;
