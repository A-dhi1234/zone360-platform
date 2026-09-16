const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export const createPayment = async (
  orderId,
  paymentMethod = "razorpay"
) => {

  const token =
    localStorage.getItem("token");

  const response =
    await fetch(
      `${API_URL}/payments/`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),
        },

        body: JSON.stringify({
          order_id: orderId,
          payment_method:
            paymentMethod,
        }),
      }
    );


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      errorText ||
      "Failed to create payment"
    );

  }


  return response.json();

};