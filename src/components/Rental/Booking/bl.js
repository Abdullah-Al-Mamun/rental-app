import { ShowConfirmBox, GetDays, IsObjectEmpty, RoundNumber, ObjectAssign } from "../../../utils/Util";
import { updateProducts } from '../../../store/Products';

export const validate = (product) => {
    let errors = {};
    let errorMsg = "";
    if (!product.availability) {
        errorMsg = "The product is not available for booking.";
        errors["error"] = true;
    }
    if (!product.code) errors["code"] = true;
    if (!product.fromDate) errors["fromDate"] = true;
    if (!product.toDate) errors["toDate"] = true;
    let days = GetDays(product.fromDate, product.toDate);
    if (days === null || days === undefined || days < 0) {
        errorMsg += "The To date must be greater than the From date.";
        errors["error"] = true;
    }
    days++;
    if (!product.discount
        && product.minimum_rent_period
        && parseInt(product.minimum_rent_period) > days) {
        errorMsg += `The user can only rent the product longer than the minimum rental period(${product.minimum_rent_period}).`;
        errors["error"] = true;
    }
    if (product.type === "plain"
        && days > parseInt(product.durability)) {
        errorMsg += "The user can only rent the product longer than the durability.";
        errors["error"] = true;
    }
    if (product.type === "meter"
        && (days * 4) > parseInt(product.durability)) {
        errorMsg += "The user can only rent the product longer than the durability.";
        errors["error"] = true;
    }
    return {
        errorMsg,
        errors,
        valid: IsObjectEmpty(errors)
    }
};

export const calculateRentalFee = (product) => {
    console.log("Calculate rental fee");
    let days = GetDays(product.fromDate, product.toDate);
    if (days === null || days === undefined || days < 0) return;
    days++;
    let rentalFee = RoundNumber(parseFloat(product.price) * days, 2);
    if (product.discount
        && product.minimum_rent_period
        && parseInt(product.minimum_rent_period) < days) {
        console.log("Calculate discount");
        const discount = RoundNumber((rentalFee / 100) * parseFloat(product.discount), 2);
        rentalFee -= discount;
        console.log("Calculated discount is: ", discount);
    }
    product.rentalFee = rentalFee;
    product.usedMileage = days * 10;
    console.log("Calculated rental fee is:  ", rentalFee);
};

export const bookProduct = (products, product, toggle) => {
    const result = validate(product);
    if (!result.valid) return result;
    calculateRentalFee(product);
    ShowConfirmBox({
        title: "Book a product",
        text: `Your estimated price is $${product.rentalFee}.\nDo you want to procedure?`,
        onOkClick: () => {
            console.log("Booking product...");
            let updatedProduct = products.find(p => p.code === product.code);
            if (updatedProduct) {
                product.availability = false;
                ObjectAssign(updatedProduct, { ...product });
                console.log("Updating data to local storage...");
                updateProducts(products);
                console.log("Booking product completed...");
                toggle();
            }
        }
    });
}