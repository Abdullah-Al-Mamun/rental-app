import { validate, calculateRentalFee } from "./bl";

const product = {
    "code": "p1",
    "name": "Air Compressor 12 GAS",
    "type": "plain",
    "availability": true,
    "needing_repair": false,
    "durability": 3000,
    "max_durability": 3000,
    "mileage": null,
    "price": 4500,
    "minimum_rent_period": 1
}

describe("booking business logic", () => {

    test("the product is invalid to booking without from & to date", () => {
        expect(validate(product)).toMatchObject({ valid: false });
    })

    test("the product is invalid to booking due to minimum period", () => {
        expect(validate({ ...product, fromDate: "10/02/2022", toDate: "10/02/2022", minimum_rent_period: 2 })).toMatchObject({ valid: false });
    })

    test("the product is invalid to booking due to availability", () => {
        expect(validate({ ...product, availability: false, fromDate: "10/02/2022", toDate: "11/02/2022" })).toMatchObject({ valid: false });
    })

    test("the product is invalid to booking due to durability", () => {
        expect(validate({ ...product, durability: 1, fromDate: "10/02/2022", toDate: "11/02/2022" })).toMatchObject({ valid: false });
    })

    test("the product is invalid to booking due to to-date is less then from-date", () => {
        expect(validate({ ...product, fromDate: "10/02/2022", toDate: "09/02/2022" })).toMatchObject({ valid: false });
    })

    test("the product is valid to booking", () => {
        expect(validate({ ...product, fromDate: "10/02/2022", toDate: "11/02/2022" })).toMatchObject({ valid: true });
    })

    test("calculateRentalFee for one day", () => {
        const feeProduct = { ...product, fromDate: "10/02/2022", toDate: "10/02/2022" };
        calculateRentalFee(feeProduct);
        expect(feeProduct.rentalFee).toBe(feeProduct.price * 1);
    })
})