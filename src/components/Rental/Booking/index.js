import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import SelectContainer from "../../Elements/SelectContainer";
import NumericContainer from "../../Elements/NumericContainer";
import DateTimeContainer from "../../Elements/DateTimeContainer";
import { bookProduct } from "./bl";

const Booking = ({ show, close, products }) => {
  const [product, setProduct] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [errors, setErrors] = useState({});

  const onSelectChange = (e) => {
    try {
      const selProduct = products.find(p => p.code === e.target.value);
      setProduct({ ...selProduct });
      setErrors({});
    }
    catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  }

  const handleDateChange = (moment, name, format) => {
    try {
      if (!moment._isValid) return;
      let value = moment.format(format);
      setProduct(prevState => ({ ...prevState, [name]: value }));
      setErrors(prevState => ({ ...prevState, [name]: false }));
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  }

  const toggle = () => {
    setProduct({});
    setErrorMsg(null);
    setErrors({});
    close();
  }

  const hasError = (name) => {
    let inputErrors = {};
    if (errors) {
      let error = errors[name];
      if (error) inputErrors[name] = true;
    }
    return inputErrors;
  };

  const bookNow = () => {
    try {      
      const result = bookProduct(products, product, toggle);      
      if (result) {
        setErrorMsg(result.errorMsg);
        setErrors(result.errors);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  }

  const sourceProducts = products.filter(p => p.availability);

  return (
    <Modal
      isOpen={show}
      toggle={toggle}
      backdrop="static"
      keyboard={true}>
      <ModalHeader>Book a product</ModalHeader>
      <ModalBody style={{ with: "1000px" }}>
        <SelectContainer
          label="Product"
          name="code"
          value={product.code}
          onChange={onSelectChange}
          data={sourceProducts}
          hasError={hasError}
        />
        <NumericContainer
          label="Mileage"
          name="mileage"
          value={product.mileage}
          readOnly
        />
        <FormGroup row>
          <label className="control-label col-xl-4">
            Need to Repair
          </label>
          <div className="col-xl-8">
            <span>{product.needing_repair ? "Yes" : "No"}</span>
          </div>
        </FormGroup>
        <DateTimeContainer
          label="From"
          name="fromDate"
          value={product.fromDate}
          isDate={true}
          onChange={handleDateChange}
          hasError={hasError}
        />
        <DateTimeContainer
          label="To"
          name="toDate"
          value={product.toDate}
          isDate={true}
          onChange={handleDateChange}
          hasError={hasError}
        />
        <Alert color="danger" isOpen={errorMsg ? true : false} toggle={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      </ModalBody>
      <ModalFooter>
        <Button style={{ width: "100px", height: "32px", marginRight: '.25em' }} label="No" icon="pi pi-times-circle" className="p-button-raised p-button-danger" onClick={toggle} />
        <Button style={{ width: "106px", height: "32px", marginRight: '.25em' }} label="Yes" icon="pi pi-check-circle" className="p-button-raised" onClick={bookNow} />
      </ModalFooter>
    </Modal>
  );
};

export default Booking;
