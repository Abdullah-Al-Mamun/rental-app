import { ShowConfirmBox, IsObjectEmpty, RoundNumber, ObjectAssign } from "../../../utils/Util";
import { updateProducts } from '../../../store/Products';

export const validate = (product) => {
    let errors = {};
    let errorMsg = "";
    if (product.availability || product.needing_repair) {
        errorMsg = "The product is not available for return.";
        errors["error"] = true;
    }
    if (!product.code) errors["code"] = true;
    if (!product.usedMileage) errors["usedMileage"] = true;
    return {
        errorMsg,
        errors,
        valid: IsObjectEmpty(errors)
    }
};

export const calculateDurability = (product) => {
    console.log("Calculate durability & rental fee");
    let days = parseInt(product.usedMileage) / 10;
    let rentalFee = RoundNumber(parseFloat(product.price) * days, 2);
    if (product.discount
        && product.minimum_rent_period
        && parseInt(product.minimum_rent_period) < days) {
        const discount = RoundNumber((rentalFee / 100) * parseFloat(product.discount), 2);
        rentalFee -= discount;
    }
    product.rentalFee = rentalFee;
    days = parseInt(days);
    if (product.type === "plain") {
        product.durability -= days;
    }
    else {
        product.durability -= (days * 4);
    }
    console.log("Available durability is: ", product.durability);
    console.log("Calculated rental free is: ", rentalFee);
};

export const returnProduct = (products, product, toggle) => {
    if (!validate(product)) return;
    const result = validate(product);
    if (!result.valid) return result;
    calculateDurability(product);
    ShowConfirmBox({
        title: "Return a product",
        text: `Your total price is $${product.rentalFee}.\nDo you want to procedure?`,
        onOkClick: () => {
            console.log("Return product...");
            let updatedProduct = products.find(p => p.code === product.code);
            if (updatedProduct) {
                product.availability = true;
                if (parseInt(product.durability) <= 0) {
                    product.availability = false;
                    product.needing_repair = false;
                }
                if (!product.mileage) product.mileage = 0;
                product.mileage += product.usedMileage;
                delete product.fromDate;
                delete product.toDate;
                delete product.rentalFee;
                delete product.usedMileage;
                ObjectAssign(updatedProduct, { ...product });
                console.log("Updating data to local storage...");
                updateProducts(products);
                console.log("Return product completed...");
                toggle();
            }
        }
    });
}