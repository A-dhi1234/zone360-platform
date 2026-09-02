import React from "react";
import { Link } from "react-router-dom";

import {
  formatPrice,
} from "../app/products";


function CartPage({
  cart,
  updateQuantity,
  removeFromCart,
  clearCart,
}) {


  // ===================================================
  // TOTAL ITEMS
  // ===================================================

  const totalItems =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );


  // ===================================================
  // CART TOTAL
  // ===================================================

  const cartTotal =
    cart.reduce(
      (total, item) =>
        total +
        item.price *
        item.quantity,
      0
    );


  // ===================================================
  // EMPTY CART
  // ===================================================

  if (cart.length === 0) {

    return (

      <section className="inner-page">

        <div className="container">

          <div className="page-heading">

            <span>
              YOUR CART
            </span>

            <h1>
              Shopping Cart
            </h1>

            <p>
              Review your selected
              Zone360 products.
            </p>

          </div>


          <div className="empty-cart">

            <div className="cart-icon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Browse our products and
              add the solutions you need.
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

        <div className="page-heading">

          <span>
            YOUR CART
          </span>

          <h1>
            Shopping Cart
          </h1>

          <p>
            Review your selected
            Zone360 products.
          </p>

        </div>


        <div className="cart-layout">

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="cart-items">

            <div className="cart-header">

              <h2>
                Cart Items
              </h2>

              <button
                type="button"
                className="clear-cart-button"
                onClick={clearCart}
              >
                Clear Cart
              </button>

            </div>


            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                {/* IMAGE */}

                <div className="cart-item-image">

                  {item.image ? (

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  ) : (

                    <div className="cart-placeholder">
                      Z360
                    </div>

                  )}

                </div>


                {/* DETAILS */}

                <div className="cart-item-details">

                  <span className="product-category">
                    {item.category}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    {formatPrice(item.price)}
                    {" "}per item
                  </p>

                </div>


                {/* QUANTITY */}

                <div className="cart-quantity">

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1
                      )
                    }
                  >
                    −
                  </button>


                  <span>
                    {item.quantity}
                  </span>


                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>

                </div>


                {/* ITEM TOTAL */}

                <div className="cart-item-total">

                  <strong>
                    {formatPrice(
                      item.price *
                      item.quantity
                    )}
                  </strong>

                </div>


                {/* REMOVE */}

                <button
                  type="button"
                  className="remove-cart-button"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  Remove
                </button>

              </div>

            ))}

          </div>


          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="cart-summary">

            <h2>
              Cart Summary
            </h2>


            <div className="summary-row">

              <span>
                Products
              </span>

              <strong>
                {cart.length}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Total Items
              </span>

              <strong>
                {totalItems}
              </strong>

            </div>


            <div className="summary-divider"></div>


            <div className="summary-price">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(cartTotal)}
              </strong>

            </div>


            <Link
              to="/quote"
              className="primary-button full-width"
            >
              Proceed / Get a Quote
            </Link>


            <Link
              to="/products"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </section>

  );

}


export default CartPage;