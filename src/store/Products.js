export const updateProducts = (products) => {
    if (products && products.length !== 0)
        localStorage.setItem("rental_products", JSON.stringify(products));
};

export const fetchProducts = () => {
    try {
        let products = localStorage.getItem("rental_products");
        if (!products) {
            try {
                products = require('./Data.json');
                updateProducts(products);
                return products;
            } catch (e) {
                return undefined;
            }
        }
        return JSON.parse(products);
    } catch (ex) {
        return undefined;
    }
};
