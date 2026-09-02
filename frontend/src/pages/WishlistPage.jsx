import React from "react";
import { Link } from "react-router-dom";

import {
  formatPrice,
} from "../app/products";


function WishlistPage({
  wishlist,
  toggleWishlist,
  addToCart,
}) {

  // =====================================================
  // EMPTY WISHLIST
  // =====================================================

  if (wishlist.length === 0) {

    return (

      <section className="inner-page">

        <div className="container">

          <div className="wishlist-empty">

            <div className="wishlist-empty-icon">
              ♡
            </div>

            <h1>
              Your Wishlist Is Empty
            </h1>

            <p>
              Save products you are interested in
              and find them easily later.
            </p>

            <Link
              to="/products"
              className="primary-button"
            >
              Browse Products
            </Link>

          </div>

        </div>

      </section>

    );

  }


  return (

    <section className="inner-page">

      <div className="container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="page-heading">

          <span>
            MY WISHLIST
          </span>

          <h1>
            Saved Products
          </h1>

          <p>
            Products you have saved for later.
          </p>

        </div>


        {/* =================================================
            WISHLIST COUNT
        ================================================= */}

        <div className="wishlist-header">

          <strong>
            {wishlist.length}
            {" "}
            {wishlist.length === 1
              ? "Product"
              : "Products"}
          </strong>

        </div>


        {/* =================================================
            WISHLIST GRID
        ================================================= */}

        <div className="product-grid product-page-grid">

          {wishlist.map((product) => (

            <div
              className="wishlist-card-wrapper"
              key={product.id}
            >

              <button
                type="button"
                className="wishlist-remove"
                onClick={() =>
                  toggleWishlist(product)
                }
                aria-label="Remove from wishlist"
              >
                ♥
              </button>


              <Link
                to={`/products/${product.id}`}
                className="product-card"
              >

                <div className="product-image">

                  {product.image ? (

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                  ) : (

                    <div className="product-placeholder">

                      <div>
                        Z360
                      </div>

                      <span>
                        Smart Automation
                      </span>

                    </div>

                  )}

                </div>


                <div className="product-card-content">

                  <span className="product-category">
                    {product.category}
                  </span>


                  <h3>
                    {product.name}
                  </h3>


                  <p>
                    {product.description}
                  </p>


                  <div className="product-card-bottom">

                    <span className="product-price">
                      {formatPrice(product.price)}
                    </span>


                    <span className="product-arrow">
                      →
                    </span>

                  </div>

                </div>

              </Link>


              {/* ADD TO CART */}

              <button
                type="button"
                className="wishlist-cart-button"
                onClick={() =>
                  addToCart(product, 1)
                }
              >
                Add To Cart
              </button>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}


export default WishlistPage;