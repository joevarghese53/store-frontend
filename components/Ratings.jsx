import React from "react";
import { FaStarHalfAlt } from "react-icons/fa";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";


const Ratings = ({ value, text }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullStars - halfStars;
  const starStyle = {
    color: "#f02d34",
    fontSize: "1.35rem",
    verticalAlign: "middle",
    transition: "transform 0.15s",
    marginRight: "0.15rem"
  };

  return (
    <div
      className="ratings-ui"
      aria-label={text ? `Rating: ${value} out of 5, ${text}` : `Rating: ${value} out of 5`}
      style={{ gap: "0.1rem", minHeight: "2.1rem", display: "flex", alignItems: "center" }}
    >
      {[...Array(fullStars)].map((_, index) => (
        <IoMdStar key={index} style={starStyle} />
      ))}
      {halfStars === 1 && <FaStarHalfAlt style={starStyle} />}
      {[...Array(emptyStar)].map((_, index) => (
        <IoMdStarOutline key={index} style={starStyle} />
      ))}
      {text && (
        <span
          className="product-review-number"
          style={{
            color: "#111",
            fontWeight: 500,
            fontSize: "1.04rem",
            marginLeft: "0.6rem",
            letterSpacing: "0.01em"
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default Ratings;
