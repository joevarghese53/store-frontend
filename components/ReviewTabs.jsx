import React, { useState } from "react";
import Link from "next/link";
import Ratings from "./Ratings";
import styles from "../styles/ReviewTabs.module.css";

// Helper for avatar initials
const getInitials = (name = "") => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

// Helper for date formatting
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return date.toLocaleDateString();
};

const ProductTabs = ({
    loadingProductReview,
    userInfo,
    submitHandler,
    rating,
    setRating,
    comment,
    setComment,
    product,
}) => {
    const [activeTab, setActiveTab] = useState(1);
    const [commentCharCount, setCommentCharCount] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const maxCommentLength = 300;

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
        setCommentCharCount(e.target.value.length);
    };

    // Modal for all reviews
    const ReviewsModal = ({ onClose, reviews }) => (
        <div className={styles["reviews-modal-overlay"]}>
            <div className={styles["reviews-modal"]}>
                <button className={styles["reviews-modal-close"]} onClick={onClose} aria-label="Close">
                    &times;
                </button>
                <div className={styles["reviews-modal-title"]}>All Reviews</div>
                <div className={styles["reviews-modal-list"]}>
                    {reviews.length === 0 && <p className={styles["no-reviews-ui"]}>No Reviews</p>}
                    {reviews.map((review) => (
                        <div key={review._id} className={styles["review-card-ui"]}>
                            <div className={styles["review-card-header-ui"]}>
                                <div className={styles["review-avatar-ui"]}>{getInitials(review.name)}</div>
                                <div className={styles["reviewer-info-ui"]}>
                                    <strong className={styles["reviewer-name-ui"]}>{review.name}</strong>
                                    <span className={styles["review-date-ui"]}>{formatDate(review.createdAt)}</span>
                                </div>
                            </div>
                            <div className={styles["review-card-body-ui"]}>
                                <p className={styles["review-comment-ui"]}>{review.comment}</p>
                                <Ratings value={review.rating} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles["review-tabs-container"]}>
            <section className={styles["review-tabs-heading-ui"]}>
                <div
                    className={`${styles["review-tab-ui"]} ${activeTab === 1 ? styles["active"] : ""}`}
                    onClick={() => handleTabClick(1)}
                >
                    Write Your Review
                </div>
                <div
                    className={`${styles["review-tab-ui"]} ${activeTab === 2 ? styles["active"] : ""}`}
                    onClick={() => handleTabClick(2)}
                >
                    All Reviews
                </div>
            </section>

            <div className={styles["review-tabs-content-scrollable"]}>
                {/* Second Part */}
                <section>
                    {activeTab === 1 && (
                        <div className={styles["review-form-ui"]}>
                            {userInfo ? (
                                <form onSubmit={submitHandler} className={styles["review-form-fields-ui"]}>
                                    <div className={styles["form-group-ui"]}>
                                        <label htmlFor="rating" className={styles["form-label-ui"]}>
                                            Rating
                                        </label>
                                        <select
                                            id="rating"
                                            required
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                            className={styles["form-select-ui"]}
                                        >
                                            <option value="">Select</option>
                                            <option value="1">★</option>
                                            <option value="2">★★</option>
                                            <option value="3">★★★</option>
                                            <option value="4">★★★★</option>
                                            <option value="5">★★★★★</option>
                                        </select>
                                    </div>

                                    <div className={styles["form-group-ui"]}>
                                        <label htmlFor="comment" className={styles["form-label-ui"]}>
                                            Comment
                                        </label>
                                        <textarea
                                            id="comment"
                                            rows="3"
                                            required
                                            maxLength={maxCommentLength}
                                            value={comment}
                                            onChange={handleCommentChange}
                                            className={styles["form-textarea-ui"]}
                                        ></textarea>
                                        <div className={styles["char-counter-ui"]}>
                                            {commentCharCount}/{maxCommentLength}
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loadingProductReview}
                                        className={styles["review-submit-btn-ui"]}
                                    >
                                        {loadingProductReview ? "Submitting..." : "Submit"}
                                    </button>
                                </form>
                            ) : (
                                <div className={styles["review-login-prompt-ui"]}>
                                    <p>
                                        Please sign in to write a review<br />
                                        <Link href="/LoginPage">
                                            <span className={styles["login-link-ui"]}>LOGIN</span>
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <section>
                    {activeTab === 2 && (
                        <div className={styles["reviews-list-ui"]}>
                            {product.reviews.length === 0 && <p className={styles["no-reviews-ui"]}>No Reviews</p>}
                            {product.reviews.slice(0, 3).map((review) => (
                                <div
                                    key={review._id}
                                    className={styles["review-card-ui"]}
                                >
                                    <div className={styles["review-card-header-ui"]}>
                                        <div className={styles["review-avatar-ui"]}>
                                            {getInitials(review.name)}
                                        </div>
                                        <div className={styles["reviewer-info-ui"]}>
                                            <strong className={styles["reviewer-name-ui"]}>{review.name}</strong>
                                            <span className={styles["review-date-ui"]}>{formatDate(review.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className={styles["review-card-body-ui"]}>
                                        <p className={styles["review-comment-ui"]}>{review.comment}</p>
                                        <Ratings value={review.rating} />
                                    </div>
                                </div>
                            ))}
                            {product.reviews.length > 3 && (
                                <button
                                    className={styles["see-all-reviews-btn"]}
                                    onClick={() => setShowAllReviews(true)}
                                >
                                    See All Reviews
                                </button>
                            )}
                            {showAllReviews && (
                                <ReviewsModal
                                    onClose={() => setShowAllReviews(false)}
                                    reviews={product.reviews}
                                />
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProductTabs;
