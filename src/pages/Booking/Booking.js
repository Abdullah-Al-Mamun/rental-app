import React from "react";
import { ButtonGroup, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import SelectContainer from "../../components/Elements/SelectContainer";
import NumericContainer from "../../components/Elements/NumericContainer";
import DateTimeContainer from "../../components/Elements/DateTimeContainer";
import SearchContainer from "../../components/Elements/SearchContainer";

import {
  AppConst, ShowConfirmBox, ObjectAssign,
  OnBooleanTemplate, OnRowIndexTemplate,
  GetDays, IsObjectEmpty, RoundNumber
} from "../../utils/Util";
import { fetchProducts, updateProducts } from '../../store/Products';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const OnDurabilityTemplate = (rowData, props) => {
  return `${rowData["durability"]}/${rowData["max_durability"]}`;
};

class Booking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: "",
      products: [],
      product: {},
      showAlert: false
    };
  }

  componentDidMount() {
    console.log("Get products");
    const products = fetchProducts();
    console.log("Getting products", products);
    this.setState({ products: products });
  }

  handleChange = (e) => {
    try {
      const { product, errors } = this.state;
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      const name = e.target.name;
      this.setState({
        product: {
          ...product,
          [name]: value
        }, errors: { ...errors, [name]: false }
      });
    } catch (err) {
      this.logError(err);
    }
  }

  handleDateChange = (moment, name, format) => {
    try {
      if (!moment._isValid) return;
      let value = moment.format(format);
      const { product, errors } = this.state;
      this.setState({
        product: {
          ...product,
          [name]: value
        }, errors: { ...errors, [name]: false }
      });
    } catch (error) {
      this.logError(error);
    }
  }

  onSelectChange = (e) => {
    try {
      const { products } = this.state;
      this.handleChange(e);
      const product = products.find(p => p.code === e.target.value);
      console.log("Select product", product);
      this.setState({
        product: { ...product },
      });
    }
    catch (error) {
      this.logError(error);
    }
  }

  useInput = (props) => {
    const { name, isDateTime, onChange } = props;
    const value = this.state.product[name];
    return {
      name: name,
      value: value,
      hasError: this.hasError,
      onChange: onChange ? onChange : (isDateTime ? e => this.handleDateChange(e, name, AppConst.DateFormat) : e => this.handleChange(e, name)),
    }
  }

  onBooking = () => {
    this.toggle(true);
  }

  onReturn = () => {
    this.toggle(false);
  }

  toggle = (isBooking) => {
    const { show } = this.state;
    this.setState({
      isBooking: isBooking,
      product: {},
      show: !show,
      errors: {},
      showAlert: false
    });
  }

  onFilter = (e) => {
    const value = e.target.value;
    this.setState({ filterValue: value });
  }

  hasError = (name) => {
    let errors = {};
    if (this.state.errors) {
      let error = this.state.errors[name];
      if (error) errors[name] = true;
    }
    return errors;
  };

  logError = (error) => {
    console.error(error);
    this.setState({
      showAlert: true,
      alertMessage: error.message
    });
  };

  validateBooking = (product) => {
    let errors = {};
    let showAlert = false;
    let message = "";
    if (!product.code) errors["code"] = true;
    if (!product.fromDate) errors["fromDate"] = true;
    if (!product.toDate) errors["toDate"] = true;
    let days = GetDays(product.fromDate, product.toDate);
    if (days === null || days === undefined || days < 0) {
      showAlert = true;
      message = "The To date must be greater than the From date.";
      errors["error"] = true;
    }
    days++;
    if (!product.discount
      && product.minimum_rent_period
      && parseInt(product.minimum_rent_period) > days) {
      showAlert = true;
      message += `The user can only rent the product longer than the minimum rental period(${product.minimum_rent_period}).`;
      errors["error"] = true;
    }
    if (product.type === "plain"
      && days > parseInt(product.durability)) {
      showAlert = true;
      message += "The user can only rent the product longer than the durability.";
      errors["error"] = true;
    }
    if (product.type === "meter"
      && (days * 4) > parseInt(product.durability)) {
      showAlert = true;
      message += "The user can only rent the product longer than the durability.";
      errors["error"] = true;
    }

    this.setState({
      errors: errors,
      showAlert: showAlert,
      alertMessage: message
    });
    return IsObjectEmpty(errors)
  };

  validateReturn = (product) => {
    let errors = {};
    if (!product.code) errors["code"] = true;
    if (!product.usedMileage) errors["usedMileage"] = true;
    this.setState({ errors: errors });
    return IsObjectEmpty(errors)
  };

  calculateRentalFee = (product) => {
    console.log("Calculate rental fee");
    let days = GetDays(product.fromDate, product.toDate);
    if (days === null || days === undefined || days < 0) return;
    days++;
    let rentalFee = RoundNumber(parseFloat(product.price) * days, 2);
    if (product.discount
      && product.minimum_rent_period
      && parseInt(product.minimum_rent_period) < days) {
      const discount = RoundNumber((rentalFee / 100) * parseFloat(product.discount), 2);
      rentalFee -= discount;
    }
    product.rentalFee = rentalFee;
    product.usedMileage = days * 10;
    console.log("Calculated rental fee is:  ", rentalFee);
  };

  calculateDurability = (product) => {
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

  bookProduct = () => {
    console.log("Booking product...");
    let that = this;
    const { products, product } = that.state;
    if (!this.validateBooking(product)) return;
    this.calculateRentalFee(product);
    ShowConfirmBox({
      title: "Book a product",
      text: `Your estimated price is $${product.rentalFee}.\nDo you want to procedure?`,
      onOkClick: () => {
        let updatedProduct = products.find(p => p.code === product.code);
        if (updatedProduct) {
          product.availability = false;
          ObjectAssign(updatedProduct, { ...product });
          updateProducts(products);
          console.log("Booking product completed...");
          that.toggle();
        }
      }
    });
  }

  returnProduct = () => {
    let that = this;
    const { products, product } = that.state;
    if (!this.validateReturn(product)) return;
    this.calculateDurability(product);
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
          updateProducts(products);
          console.log("Return product completed...");
          that.toggle();
        }
      }
    });
  }

  update = () => {
    try {
      const { isBooking } = this.state;
      if (isBooking) this.bookProduct();
      else this.returnProduct();
    }
    catch (error) {
      this.logError(error);
    }
  }

  render() {
    const { show, filterValue, isBooking, products, product, showAlert, alertMessage } = this.state;
    const sourceProducts = products.filter(p => (isBooking && p.availability)
      || (!isBooking && !p.availability && !p.needing_repair));
    return <div style={{ margin: "10px" }}>
      <div className="card">
        <SearchContainer
          value={filterValue}
          onChange={this.onFilter}
          readOnly
        />
        <DataTable value={products}
          globalFilter={filterValue}
          filterMatchMode="contains"
          paginator rows={8} totalRecords={products.length}
          scrollable
          className="p-datatable-gridlines p-datatable-sm"
          scrollHeight="500px"
          selectionMode="single"
          resizableColumns columnResizeMode="fit" showGridlines responsiveLayout="scroll"
        >
          <Column field="i" header="SL#" body={OnRowIndexTemplate} style={{ width: '60px' }} />
          <Column field="name" header="Name" sortable="true" filter="true" filterMatchMode="contains" style={{ width: '25%' }}></Column>
          <Column field="code" header="Code" sortable="true" filter="true" filterMatchMode="contains" style={{ width: '150px' }}></Column>
          <Column field="availability" header="Availability" body={OnBooleanTemplate} sortable="true" filter="true" filterMatchMode="contains" style={{ width: '150px' }}></Column>
          <Column field="needing_repair" header="Need to Repair" body={OnBooleanTemplate} sortable="true" filter="true" filterMatchMode="contains" style={{ width: '150px' }}></Column>
          <Column field="durability" header="Durability" body={OnDurabilityTemplate} sortable="true" filter="true" filterMatchMode="contains" style={{ width: '180px' }}></Column>
          <Column field="mileage" header="Mileage" sortable="true" filter="true" filterMatchMode="contains" style={{ width: '150px' }}></Column>
          <Column field="price" header="Price" sortable="true" filter="true" filterMatchMode="contains" style={{ width: '150px' }}></Column>
        </DataTable>
      </div>
      <Modal
        isOpen={show}
        toggle={this.toggle}
        backdrop="static"
        keyboard={true}>
        <ModalHeader>{isBooking ? "Book a product" : "Return a product"}</ModalHeader>
        <ModalBody style={{ with: "1000px" }}>
          <SelectContainer
            label="Product"
            data={sourceProducts}
            {...this.useInput({ name: "code", onChange: this.onSelectChange })}
          />
          {isBooking && <NumericContainer
            label="Mileage"
            {...this.useInput({ name: "mileage" })}
            readOnly
          />}
          <DateTimeContainer
            label="From"
            isDate={true}
            {...this.useInput({ name: "fromDate", isDateTime: true })}
            readOnly={!isBooking}
          />
          <DateTimeContainer
            label="To"
            isDate={true}
            {...this.useInput({ name: "toDate", isDateTime: true })}
            readOnly={!isBooking}
          />
          <FormGroup row>
            <label className="control-label col-xl-4">
              Need to Repair
            </label>
            <div className="col-xl-8">
              <span>{product.needing_repair ? "Yes" : "No"}</span>
            </div>
          </FormGroup>
          {!isBooking && <NumericContainer
            label="Used Mileage"
            {...this.useInput({ name: "usedMileage" })}
          />}
          <Alert color="danger" isOpen={showAlert} toggle={() => this.setState({ showAlert: false })}>
            {alertMessage}
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button style={{ width: "100px", height: "32px", marginRight: '.25em' }} onClick={this.toggle} label="No" icon="pi pi-times-circle" className="p-button-raised p-button-danger" />
          <Button style={{ width: "106px", height: "32px", marginRight: '.25em' }} onClick={this.update} label="Yes" icon="pi pi-check-circle" className="p-button-raised" />
        </ModalFooter>
      </Modal>
      <footer className="app-footer">
        <ButtonGroup vertical={false}>
          <Button className="main-button p-button-info" label="Book" icon="pi pi-check-circle" onClick={this.onBooking} />
          <Button className="main-button p-button-info" label="Return" icon="pi pi-replay" onClick={this.onReturn} />
        </ButtonGroup>
      </footer>
    </div >
  }
}

export default Booking
