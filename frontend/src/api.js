const API_URL = "http://127.0.0.1:8000";


export const getProducts = async () => {

  const response =
    await fetch(
      `${API_URL}/products/`
    );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch products"
    );

  }


  return response.json();

};


export const getProduct = async (
  productId
) => {

  const response =
    await fetch(
      `${API_URL}/products/${productId}`
    );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch product"
    );

  }


  return response.json();

};