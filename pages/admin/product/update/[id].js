import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGetProductByIdQuery, useUpdateProductMutation, useDeleteProductMutation, useUploadProductImageMutation } from '../../../../redux/api/productApiSlice';
import { useRemoveAllOfProductFromAllofCartMutation } from '../../../../redux/api/cartApiSlice';
import { useFetchCategoriesQuery } from '../../../../redux/api/categoryApiSlice';
import { useRemoveFromAllWishListMutation } from '../../../../redux/api/wishlistApiSlice';
import { toast } from 'react-toastify';

const ProductUpdate = () => {
    const router = useRouter();
    const { id: productId } = router.query;

    useEffect(() => {
        console.log('Product ID:', productId);
    }, [productId]);

    const { data: productData } = useGetProductByIdQuery(productId, {
        skip: !productId,
    });

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [gender, setGender] = useState("");
    const [stock, setStock] = useState("");
    const [offers, setOffers] = useState("");
    const [returnpolicy, setReturnPolicy] = useState("");
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontDesign, setFrontDesign] = useState(null);
    const [backDesign, setBackDesign] = useState(null);
    const [images, setImages] = useState([]);
    const [frontImageUrl, setFrontImageUrl] = useState(null);
    const [backImageUrl, setBackImageUrl] = useState(null);
    const [frontDesignUrl, setFrontDesignUrl] = useState(null);
    const [backDesignUrl, setBackDesignUrl] = useState(null);
    const [imagesUrl, setImagesUrl] = useState([]);
    const [frontImageUrlToDisplay, setFrontImageUrlToDisplay] = useState(null);
    const [backImageUrlToDisplay, setBackImageUrlToDisplay] = useState(null);
    const [frontDesignUrlToDisplay, setFrontDesignUrlToDisplay] = useState(null);
    const [backDesignUrlToDisplay, setBackDesignUrlToDisplay] = useState(null);
    const [imagesUrlToDisplay, setImagesUrlToDisplay] = useState([]);

    const { data: categories = [] } = useFetchCategoriesQuery();

    const [uploadProductImage] = useUploadProductImageMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [removeAllOfProductFromAllofCart] = useRemoveAllOfProductFromAllofCartMutation();
    const [removeFromAllWishlist] = useRemoveFromAllWishListMutation();

    useEffect(() => {
        if (productData) {
            setName(productData.name);
            setDescription(productData.description);
            setPrice(productData.price);
            setCategory(productData.category);
            setGender(productData.gender);
            setStock(productData.countInStock);
            setOffers(productData.offers);
            setReturnPolicy(productData.returnpolicy);
            setFrontImageUrl(productData.frontImage);
            setBackImageUrl(productData.backImage);
            setFrontDesignUrl(productData.frontDesign);
            setBackDesignUrl(productData.backDesign);
            setImagesUrl(productData.images);
            setFrontImageUrlToDisplay(productData.frontImage);
            setBackImageUrlToDisplay(productData.backImage);
            setFrontDesignUrlToDisplay(productData.frontDesign);
            setBackDesignUrlToDisplay(productData.backDesign);
            setImagesUrlToDisplay(productData.images);
            console.log('productData:', productData);
        }
    }, [productData]);

    useEffect(() => {
        if (productData) {
            console.log('Product category from productData:', productData.category);
            setCategory(productData.category); // This should set the category correctly
        }
    }, [productData]);

    useEffect(() => {
        console.log('Updated category state:', category);
    }, [category]);


    const uploadImages = async (e) => {
        const formData = new FormData();
        if (frontImage) formData.append("frontImage", frontImage);
        if (backImage) formData.append("backImage", backImage);
        if (frontDesign) formData.append("frontDesign", frontDesign);
        if (backDesign) formData.append("backDesign", backDesign);
        if (images.length) {
            images.forEach((image) => {
                formData.append("images", image);
            });
        }
        try {
            const res = await uploadProductImage(formData).unwrap();
            if (res.imageUrls?.frontImage?.[0]) setFrontImageUrl(res.imageUrls.frontImage[0]);
            if (res.imageUrls?.backImage?.[0]) setBackImageUrl(res.imageUrls.backImage[0]);
            if (res.imageUrls?.frontDesign?.[0]) setFrontDesignUrl(res.imageUrls.frontDesign[0]);
            if (res.imageUrls?.backDesign?.[0]) setBackDesignUrl(res.imageUrls.backDesign[0]);
            if (res.imageUrls?.images) setImagesUrl([...res.imageUrls.images, ...imagesUrl]);
            toast.success('Images uploaded successfully');
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("frontImage", frontImageUrl);
            formData.append("backImage", backImageUrl);
            formData.append("frontDesign", frontDesignUrl);
            formData.append("backDesign", backDesignUrl);
            formData.append("images", JSON.stringify(imagesUrl));
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("gender", gender);
            formData.append("countInStock", stock);
            formData.append("offers", offers);
            formData.append("returnpolicy", returnpolicy);

            console.log("productData");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const data = await updateProduct({ productId: productId, formData });

            console.log('data:', data);
            if (data?.error) {
                console.log(data.error);
            } else if (data.data.success) {
                console.log("Product updated successfully", data);
                router.replace('/ProductList');
            }
            console.log('front image:', frontImageUrl);
            console.log('back image:', backImageUrl);
            console.log('front design:', frontDesignUrl);
            console.log('back design:', backDesignUrl);
            console.log('images:', imagesUrl);

        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async () => {
        try {
            let answer = window.confirm(
                "Are you sure you want to delete this product?"
            );
            if (!answer) return;

            console.log('Removing product from cart:', productId);
            const removeFromAllWishlistResponse = await removeFromAllWishlist(productId).unwrap();
            const removeFromAllCartResponse = await removeAllOfProductFromAllofCart({ productId: productId }).unwrap();
            if (removeFromAllCartResponse.success && removeFromAllWishlistResponse.success) {
                const { data } = await deleteProduct(productId);
                console.log('Product deleted successfully', data);
                router.replace('/ProductList');
            }
        } catch (err) {
            console.log(err);
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

    if (!productId) return <div>Loading...</div>;

    return (
        <div className="create-product-container">
            <h2 className="create-product-heading">Update/Delete Product</h2>

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
            <button id='create-product-submit' onClick={uploadImages}>Upload Images</button>

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
                            value={category}
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
                    Update
                </button>
                <button id='create-product-submit'
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ProductUpdate;
