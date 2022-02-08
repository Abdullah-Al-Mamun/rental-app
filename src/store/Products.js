export const updateProducts = (products) => {
    try {
        if (products
            && products.length !== 0)
            localStorage.setItem("rental_products", JSON.stringify(products));
    }
    catch (error) {
        throw error;
    }
};

export const fetchProducts = () => {
    try {
        let products = localStorage.getItem("rental_products");
        if (!products) {
            products = require('./Data.json');
            updateProducts(products);
            return products;
        }
        return JSON.parse(products);
    } catch (error) {
        throw error;
    }
};
