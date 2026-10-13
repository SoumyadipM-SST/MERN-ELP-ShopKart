import axios from "axios";

export const getProducts = async ({ search = "", category = "" } = {}) => {
    const response = await axios.get(`http://localhost:8000/customer/products`, {
        params: {
            search,
            category,
        },
        withCredentials: true,
    });
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(
        `http://localhost:8000/customer/products/${id}`,
        {
            withCredentials: true,
        }
    );
    return response.data;
};