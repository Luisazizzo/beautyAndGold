const BASE_URL = "https://fakestoreapi.com/products";

const GET = async (category = "") => {
  const res = await fetch(BASE_URL + category);
  const data = await res.json();
  return data;
};

export { GET };
