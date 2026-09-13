const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export async function createPayment(
  orderId,
  paymentMethod = "razorpay"
) {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `${API_URL}/payments/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        order_id: orderId,
        payment_method: paymentMethod,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Payment creation failed"
    );
  }

  return data;
}