import React, { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  products,
  formatPrice,
} from "../app/products";


function ProductDetails({
  addToCart,
}) {

  const { productId } =
    useParams();

  const navigate =
    useNavigate();


  const [quantity, setQuantity] =
    useState(1);


  const [addedMessage, setAddedMessage] =
    useState("");


  const product =
    products.find(
      (item) =>
        item.id === productId
    );


  // ===================================================
  // PRODUCT NOT FOUND
  // ===================================================

  if (!product) {

    return (

      <section className="inner-page">

        <div className="container">

          <div className="not-found-small">

            <h1>
              Product Not Found
            </h1>

            <Link
              to="/products"
              className="primary-button"
            >
              Back To Products
            </Link>

          </div>

        </div>

      </section>

    );

  }


  // ===================================================
  // INCREASE
  // ===================================================

  const increaseQuantity = () => {

    setQuantity(
      (current) =>
        current + 1
    );

  };


  // ===================================================
  // DECREASE
  // ===================================================

  const decreaseQuantity = () => {

    setQuantity(
      (current) =>
        current > 1
          ? current - 1
          : 1
    );

  };


  // ===================================================
  // ADD TO CART
  // ===================================================

  const handleAddToCart = () => {

    addToCart(
      product,
      quantity
    );


    setAddedMessage(
      `${quantity} × ${product.name} added to cart.`
    );


    setTimeout(() => {

      setAddedMessage("");

    }, 3000);

  };


  // ===================================================
  // BUY NOW
  // ===================================================

  const handleBuyNow = () => {

    addToCart(
      product,
      quantity
    );

    navigate("/cart");

  };


  return (

    <section className="product-detail-page">

      <div className="container">

        {/* BREADCRUMB */}

        <div className="breadcrumb">

          <Link to="/">
            Home
          </Link>

          <span>
            /
          </span>

          <Link to="/products">
            Products
          </Link>

          <span>
            /
          </span>

          <strong>
            {product.name}
          </strong>

        </div>


        {/* SUCCESS */}

        {addedMessage && (

          <div className="cart-success-message">

            ✓ {addedMessage}

          </div>

        )}


        <div className="product-detail-grid">

          {/* IMAGE */}

          <div className="product-detail-image">

            {product.image ? (

              <img
                src={product.image}
                alt={product.name}
              />

            ) : (

              <div className="detail-placeholder">

                <div>
                  Z360
                </div>

                <span>
                  Smart Automation
                </span>

              </div>

            )}

          </div>


          {/* DETAILS */}

          <div className="product-detail-content">

            <span className="product-category">
              {product.category}
            </span>


            <h1>
              {product.name}
            </h1>


            <p className="product-detail-description">
              {product.description}
            </p>


            {/* PRICE */}

            <div className="price-box">

              <span>
                Price
              </span>

              <strong>
                {formatPrice(product.price)}
              </strong>

              <small>
                Product price. Additional
                service charges may apply.
              </small>

            </div>


            {/* FEATURES */}

            <div className="features">

              <h3>
                Key Features
              </h3>


              {product.features.map(
                (feature, index) => (

                  <div
                    className="feature-item"
                    key={index}
                  >

                    <span>
                      ✓
                    </span>

                    <p>
                      {feature}
                    </p>

                  </div>

                )
              )}

            </div>


            {/* QUANTITY */}

            <div className="quantity-area">

              <span>
                Quantity
              </span>


              <div className="quantity-control">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                >
                  −
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                >
                  +
                </button>

              </div>

            </div>


            {/* TOTAL */}

            <div className="product-selected-total">

              <span>
                Selected Total
              </span>

              <strong>
                {formatPrice(
                  product.price *
                  quantity
                )}
              </strong>

            </div>


            {/* ACTIONS */}

            <div className="product-actions">

              <button
                type="button"
                className="primary-button"
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>


              <button
                type="button"
                className="secondary-button"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

            </div>


            <div className="support-note">

              <span>
                🛡
              </span>

              <p>
                Need help choosing the right
                solution? Contact our team.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}


export default ProductDetails;