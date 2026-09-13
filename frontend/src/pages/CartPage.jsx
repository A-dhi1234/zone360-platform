import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;


function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [error, setError] = useState("");


  // Get login token
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token")
    );
  };


  // Load cart and products
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }


      // Get cart
      const cartResponse = await fetch(
        `${API_URL}/cart/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const cartData = await cartResponse.json();


      if (!cartResponse.ok) {
        throw new Error(
          cartData.detail || "Failed to load cart"
        );
      }


      // Get products
      const productResponse = await fetch(
        `${API_URL}/products/`,
        {
          method: "GET",
        }
      );


      const productData =
        await productResponse.json();


      if (!productResponse.ok) {
        throw new Error(
          productData.detail ||
          "Failed to load products"
        );
      }


      setCart(cartData);
      setProducts(productData);

    } catch (err) {
      console.error("Cart error:", err);

      setError(
        err.message ||
        "Unable to load your cart."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
  }, []);


  // Find product information
  const getProduct = (productId) => {
    return products.find(
      (product) =>
        product.id === productId
    );
  };


  // Update quantity
  const updateQuantity = async (
    itemId,
    currentQuantity,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }


    try {
      setUpdatingItem(itemId);
      setError("");

      const token = getToken();


      if (!token) {
        navigate("/login");
        return;
      }


      const response = await fetch(
        `${API_URL}/cart/items/${itemId}?quantity=${newQuantity}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Failed to update quantity"
        );
      }


      // Reload cart after update
      await loadData();

    } catch (err) {
      console.error(
        "Quantity update error:",
        err
      );

      setError(
        err.message ||
        "Failed to update quantity."
      );
    } finally {
      setUpdatingItem(null);
    }
  };


  // Go to checkout
  const handleCheckout = () => {
    if (!cart || !cart.items?.length) {
      return;
    }


    navigate("/checkout", {
      state: {
        cart: cart,
      },
    });
  };


  // Go to quote page
  const handleQuote = () => {
    navigate("/quote");
  };


  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
        }}
      >
        Loading cart...
      </div>
    );
  }


  // Error state
  if (error && !cart) {
    return (
      <div
        style={{
          minHeight: "70vh",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <h2>
          Unable to load cart
        </h2>

        <p
          style={{
            color: "#666",
            marginTop: "10px",
          }}
        >
          {error}
        </p>

        <button
          onClick={loadData}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }


  const items = cart?.items || [];


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        paddingBottom: "60px",
      }}
    >

      {/* Page Header */}
      <section
        style={{
          textAlign: "center",
          padding: "70px 20px 50px",
        }}
      >

        <h1
          style={{
            fontSize: "56px",
            color: "#0b1d3a",
            margin: 0,
          }}
        >
          Shopping Cart
        </h1>

        <p
          style={{
            marginTop: "15px",
            color: "#667085",
            fontSize: "18px",
          }}
        >
          Review your selected
          Zone360 products.
        </p>

      </section>


      {/* Error message */}
      {error && (
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto 20px",
            padding: "15px 20px",
            background: "#fff0f0",
            color: "#c62828",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}


      {/* Empty Cart */}
      {items.length === 0 ? (
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
            padding: "50px 20px",
          }}
        >

          <div
            style={{
              fontSize: "60px",
              marginBottom: "20px",
            }}
          >
            🛒
          </div>

          <h2>
            Your cart is empty.
          </h2>

          <p
            style={{
              color: "#667085",
              marginTop: "10px",
            }}
          >
            Explore our products and
            add something to your cart.
          </p>

          <button
            onClick={() => navigate("/products")}
            style={{
              marginTop: "25px",
              padding: "14px 28px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </button>

        </div>
      ) : (

        /* Cart Content */
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 20px",
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1fr) 360px",
            gap: "35px",
          }}
        >

          {/* Cart Items */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >

            <div
              style={{
                padding: "25px",
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#0b1d3a",
                }}
              >
                Cart Items
              </h2>
            </div>


            {items.map((item) => {

              const product =
                getProduct(item.product_id);


              const productName =
                product?.name ||
                `Product #${item.product_id}`;


              const productImage =
                product?.image;


              const itemTotal =
                item.price *
                item.quantity;


              return (
                <div
                  key={item.id}
                  style={{
                    padding: "25px",
                    borderBottom:
                      "1px solid #e5e7eb",
                    display: "flex",
                    gap: "25px",
                    alignItems: "center",
                  }}
                >

                  {/* Product Image */}
                  <div
                    style={{
                      width: "110px",
                      height: "110px",
                      borderRadius: "10px",
                      background: "#f5f7fb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >

                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: "35px",
                        }}
                      >
                        📦
                      </span>
                    )}

                  </div>


                  {/* Product Information */}
                  <div
                    style={{
                      flex: 1,
                    }}
                  >

                    <div
                      style={{
                        color: "#2563eb",
                        fontSize: "13px",
                        fontWeight: "700",
                        textTransform:
                          "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      {product?.category ||
                        "ZONE360 PRODUCT"}
                    </div>


                    <h3
                      style={{
                        margin: 0,
                        color: "#0b1d3a",
                        fontSize: "21px",
                      }}
                    >
                      {productName}
                    </h3>


                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        color: "#667085",
                      }}
                    >
                      ₹{item.price.toLocaleString("en-IN")}{" "}
                      per item
                    </p>


                    {/* Quantity */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0",
                        marginTop: "18px",
                      }}
                    >

                      <button
                        disabled={
                          updatingItem ===
                          item.id ||
                          item.quantity <= 1
                        }
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity,
                            item.quantity - 1
                          )
                        }
                        style={{
                          width: "38px",
                          height: "38px",
                          border:
                            "1px solid #d9dee8",
                          background: "#ffffff",
                          cursor:
                            item.quantity <= 1
                              ? "not-allowed"
                              : "pointer",
                          borderRadius:
                            "6px 0 0 6px",
                          fontSize: "18px",
                        }}
                      >
                        −
                      </button>


                      <div
                        style={{
                          width: "50px",
                          height: "38px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "center",
                          borderTop:
                            "1px solid #d9dee8",
                          borderBottom:
                            "1px solid #d9dee8",
                          fontWeight: "600",
                        }}
                      >
                        {item.quantity}
                      </div>


                      <button
                        disabled={
                          updatingItem ===
                          item.id
                        }
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity,
                            item.quantity + 1
                          )
                        }
                        style={{
                          width: "38px",
                          height: "38px",
                          border:
                            "1px solid #d9dee8",
                          background: "#ffffff",
                          cursor: "pointer",
                          borderRadius:
                            "0 6px 6px 0",
                          fontSize: "18px",
                        }}
                      >
                        +
                      </button>

                    </div>

                  </div>


                  {/* Item Total */}
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "18px",
                      color: "#0b1d3a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ₹
                    {itemTotal.toLocaleString(
                      "en-IN"
                    )}
                  </div>

                </div>
              );
            })}

          </div>


          {/* Cart Summary */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "25px",
              height: "fit-content",
              position: "sticky",
              top: "100px",
            }}
          >

            <h2
              style={{
                marginTop: 0,
                color: "#0b1d3a",
              }}
            >
              Cart Summary
            </h2>


            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginTop: "25px",
                color: "#667085",
              }}
            >
              <span>
                Products
              </span>

              <strong>
                {items.length}
              </strong>
            </div>


            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginTop: "18px",
                color: "#667085",
              }}
            >
              <span>
                Total Items
              </span>

              <strong>
                {items.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </strong>
            </div>


            <hr
              style={{
                margin:
                  "25px 0",
                border: 0,
                borderTop:
                  "1px solid #e5e7eb",
              }}
            />


            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >

              <strong
                style={{
                  fontSize: "18px",
                  color: "#0b1d3a",
                }}
              >
                Total
              </strong>

              <strong
                style={{
                  fontSize: "22px",
                  color: "#2563eb",
                }}
              >
                ₹
                {(cart?.total || 0).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              style={{
                width: "100%",
                marginTop: "25px",
                padding: "15px",
                border: "none",
                borderRadius: "8px",
                background: "#2563eb",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Proceed to Checkout
            </button>


            {/* Quote Button */}
            <button
              onClick={handleQuote}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "15px",
                border: "1px solid #2563eb",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#2563eb",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Get a Quote
            </button>


            {/* Continue Shopping */}
            <button
              onClick={() =>
                navigate("/products")
              }
              style={{
                width: "100%",
                marginTop: "18px",
                padding: "10px",
                border: "none",
                background: "transparent",
                color: "#2563eb",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              ← Continue Shopping
            </button>

          </div>

        </div>
      )}

    </div>
  );
}


export default CartPage;