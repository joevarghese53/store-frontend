import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGetProductByIdQuery, useUpdateProductMutation, useDeleteProductMutation, useUploadProductImageMutation } from '../../../../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../../../../redux/api/categoryApiSlice';

const ProductUpdate = () => {
    const router = useRouter();
    const { id: productId } = router.query;

    useEffect(() => {
        console.log('Product ID:', productId);
    }, [productId]);

    const { data: productData } = useGetProductByIdQuery(productId, {
        skip: !productId,
    });

    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [stock, setStock] = useState("");
    const [offers, setOffers] = useState("");
    const [returnpolicy, setReturnPolicy] = useState("");

    const { data: categories = [] } = useFetchCategoriesQuery();

    const [uploadProductImage] = useUploadProductImageMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    useEffect(() => {
        if (productData) {
            setName(productData.name);
            setDescription(productData.description);
            setPrice(productData.price);
            setCategory(productData.category?._id || "");
            setBrand(productData.brand);
            setImage(productData.image);
            setStock(productData.countInStock);
            setOffers(productData.offers);
            setReturnPolicy(productData.returnpolicy);
        }
    }, [productData]);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            setImage(res.image);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("brand", brand);
            formData.append("countInStock", stock);
            formData.append("offers", offers);
            formData.append("returnpolicy", returnpolicy);

            const data = await updateProduct({ productId: productId, formData });

            if (data?.error) {
                console.log(data.error);
            } else {
                console.log("Product updated successfully", data);
                router.replace('/ProductList');
            }
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

            const { data } = await deleteProduct(productId);
            console.log('Product deleted successfully', data);
            router.replace('/ProductList');
        } catch (err) {
            console.log(err);
        }
    };

    if (!productId) return <div>Loading...</div>;

    return (
        <div className="create-product-container">
            <h2 className="create-product-heading">Update/Delete Product</h2>

            {image && (
                <div className="create-product-image">
                    <img
                        src={image}
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
