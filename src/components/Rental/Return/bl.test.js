import { validate, calculateDurability } from "./bl";

const product = {
    "code": "p1",
    "name": "Air Compressor 12 GAS",
    "type": "plain",
    "availability": false,
    "needing_repair": false,
    "durability": 3000,
    "max_durability": 3000,
    "mileage": null,
    "price": 4500,
    "minimum_rent_period": 1,
    fromDate: "10/02/2022",
    toDate: "11/02/2022"
}

describe("return business logic", () => {

    test("the product is invalid to return without used mileage", () => {
        expect(validate(product)).toMatchObject({ valid: false });
    })

    test("the product is invalid to return without booking", () => {
        expect(validate({ ...product, availability: true })).toMatchObject({ valid: false });
    })

    test("the product is valid to return", () => {
        expect(validate({ ...product, usedMileage: 20 })).toMatchObject({ valid: true });
    })

    test("calculateDurability for two day", () => {
        const feeProduct = { ...product, usedMileage: 20 };
        calculateDurability(feeProduct);
        expect(feeProduct.durability).toBe(3000 - 2);
    })
})