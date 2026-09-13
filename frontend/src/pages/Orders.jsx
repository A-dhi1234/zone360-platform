import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token")
    );
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        // -----------------------------------------------
        // CHECK LOGIN
        // -----------------------------------------------

        if (!token) {
          navigate("/login");
          return;
        }

        // -----------------------------------------------
        // GET CUSTOMER ORDERS
        // -----------------------------------------------

        const response = await fetch(
          `${API_URL}/orders/`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        // -----------------------------------------------
        // TOKEN EXPIRED
        // -----------------------------------------------

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem(
            "access_token"
          );

          navigate("/login");
          return;
        }

        const data =
          await response.json();

        console.log(
          "Orders response:",
          data
        );

        // -----------------------------------------------
        // API ERROR
        // -----------------------------------------------

        if (!response.ok) {
          throw new Error(
            data.detail ||
              "Unable to load orders."
          );
        }

        // -----------------------------------------------
        // SAVE ORDERS
        // -----------------------------------------------

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {
        console.error(
          "Orders loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load orders."
        );

      } finally {
        setLoading(false);
      }
    };

    loadOrders();

  }, [navigate]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section
        className="inner-page"
        style={{
          padding:
            "80px 20px",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth:
              "1100px",
            margin:
              "0 auto",
            textAlign:
              "center",
          }}
        >
          <h1>
            My Orders
          </h1>

          <p>
            Loading your orders...
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <section
      className="inner-page"
      style={{
        padding:
          "60px 20px 80px",
        minHeight:
          "70vh",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth:
            "1100px",
          margin:
            "0 auto",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="page-heading"
          style={{
            marginBottom:
              "35px",
          }}
        >
          <span>
            ORDER MANAGEMENT
          </span>

          <h1>
            My Orders
          </h1>

          <p>
            View your orders and
            payment status.
          </p>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            style={{
              padding:
                "16px",
              marginBottom:
                "25px",
              background:
                "#fee2e2",
              color:
                "#b91c1c",
              borderRadius:
                "8px",
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            NO ORDERS
        ================================================= */}

        {!error &&
          orders.length === 0 && (
            <div
              className="checkout-card"
              style={{
                padding:
                  "50px",
                textAlign:
                  "center",
              }}
            >
              <h2>
                No Orders Yet
              </h2>

              <p
                style={{
                  color:
                    "#64748b",
                  margin:
                    "12px 0 25px",
                }}
              >
                You haven't placed
                any orders yet.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  navigate(
                    "/products"
                  )
                }
              >
                Browse Products
              </button>
            </div>
          )}

        {/* =================================================
            ORDER LIST
        ================================================= */}

        {orders.length > 0 && (
          <div
            style={{
              display:
                "flex",
              flexDirection:
                "column",
              gap:
                "20px",
            }}
          >

            {orders.map(
              (order) => (
                <div
                  key={
                    order.order_id
                  }
                  className="checkout-card"
                  style={{
                    padding:
                      "25px",
                  }}
                >

                  {/* =======================================
                      ORDER HEADER
                  ======================================= */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      gap:
                        "20px",
                      flexWrap:
                        "wrap",
                      paddingBottom:
                        "18px",
                      borderBottom:
                        "1px solid #e5e7eb",
                    }}
                  >

                    <div>
                      <h2
                        style={{
                          margin:
                            "0 0 6px",
                        }}
                      >
                        Order #
                        {
                          order.order_id
                        }
                      </h2>

                      <p
                        style={{
                          margin:
                            "0",
                          color:
                            "#64748b",
                        }}
                      >
                        Customer ID:{" "}
                        {
                          order.user_id
                        }
                      </p>
                    </div>

                    {/* STATUS */}

                    <span
                      style={{
                        display:
                          "inline-block",

                        padding:
                          "8px 16px",

                        borderRadius:
                          "20px",

                        fontWeight:
                          "600",

                        textTransform:
                          "capitalize",

                        background:
                          order.status ===
                          "delivered"
                            ? "#dcfce7"
                            : order.status ===
                              "cancelled"
                            ? "#fee2e2"
                            : order.status ===
                              "paid"
                            ? "#dcfce7"
                            : "#fef3c7",

                        color:
                          order.status ===
                          "delivered"
                            ? "#166534"
                            : order.status ===
                              "cancelled"
                            ? "#b91c1c"
                            : "#92400e",
                      }}
                    >
                      {order.status}
                    </span>

                  </div>

                  {/* =======================================
                      ORDER ITEMS
                  ======================================= */}

                  <div
                    style={{
                      marginTop:
                        "20px",
                    }}
                  >

                    <h3>
                      Order Items
                    </h3>

                    {order.items &&
                      order.items.map(
                        (item) => (
                          <div
                            key={
                              item.id
                            }
                            style={{
                              display:
                                "flex",

                              justifyContent:
                                "space-between",

                              alignItems:
                                "center",

                              padding:
                                "14px 0",

                              borderBottom:
                                "1px solid #f1f5f9",
                            }}
                          >

                            <div>

                              <strong>
                                Product #
                                {
                                  item.product_id
                                }
                              </strong>

                              <div
                                style={{
                                  marginTop:
                                    "5px",

                                  color:
                                    "#64748b",
                                }}
                              >
                                Quantity:{" "}
                                {
                                  item.quantity
                                }
                              </div>

                            </div>

                            <strong>
                              {formatPrice(
                                item.price *
                                  item.quantity
                              )}
                            </strong>

                          </div>
                        )
                      )}

                  </div>

                  {/* =======================================
                      TOTAL
                  ======================================= */}

                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      marginTop:
                        "20px",

                      paddingTop:
                        "18px",

                      borderTop:
                        "2px solid #e5e7eb",
                    }}
                  >

                    <strong
                      style={{
                        fontSize:
                          "20px",
                      }}
                    >
                      Total
                    </strong>

                    <strong
                      style={{
                        fontSize:
                          "24px",
                      }}
                    >
                      {formatPrice(
                        order.total_amount
                      )}
                    </strong>

                  </div>

                  {/* =======================================
                      VIEW ORDER
                  ======================================= */}

                  <button
                    type="button"
                    className="outline-btn"
                    style={{
                      marginTop:
                        "20px",
                      cursor:
                        "pointer",
                    }}
                    onClick={() =>
                      navigate(
                        `/orders/${order.order_id}`
                      )
                    }
                  >
                    View Order Details →
                  </button>

                </div>
              )
            )}

          </div>
        )}

      </div>
    </section>
  );
}

export default Orders;