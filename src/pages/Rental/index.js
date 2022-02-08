import React, { useEffect, useState } from 'react';
import { ButtonGroup, Alert } from 'reactstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { fetchProducts } from '../../store/Products';
import {
    OnBooleanTemplate, OnRowIndexTemplate
} from "../../utils/Util";

import SearchContainer from "../../components/Elements/SearchContainer";
import Booking from "../../components/Rental/Booking";
import Return from "../../components/Rental/Return";
import LogRocket from 'logrocket';

const LOG_ROCKET_PROJECT_ID = 'umqbjl/rentalapp'

const OnDurabilityTemplate = (rowData) => {
    return `${rowData["durability"]}/${rowData["max_durability"]}`;
};

const Rental = () => {
    const [products, setProducts] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [showBooking, setShowBooking] = useState(false);
    const [showReturn, setShowReturn] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (!products.length) {
            try {
                LogRocket.init('umqbjl/rentalapp');
                const user = {
                    name: "Abdullah Al Mamun",
                    email: "ablmamuntue@gmail.com",
                    recordFrontendLogging: true,
                    recordFrontendNetworkCalls: true,
                    recordFrontendUI: false,
                    associateFrontendLogsWithUser: true,
                }
                if (user && user.recordFrontendNetworkCalls) {
                    LogRocket.init(LOG_ROCKET_PROJECT_ID, {
                        network: {
                            isEnabled: true,
                        }
                    })
                } else {
                    LogRocket.init(LOG_ROCKET_PROJECT_ID, {
                        network: {
                            isEnabled: false,
                        }
                    })
                }

                if (user && user.associateFrontendLogsWithUser) {
                    LogRocket.identify(user.email, {
                        // Any additional fields
                    })
                }
                console.log("Get products");
                const dbProducts = fetchProducts();
                console.log("Getting products", dbProducts);
                setProducts(dbProducts);
            }
            catch (error) {
                console.error(error);
                setErrorMsg(error.message);
            }
        }
    }, [products])

    return (
        <div className="card">
            <SearchContainer
                value={filterValue}
                onChange={e => setFilterValue(e.target.value)}
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
            <Booking show={showBooking} close={e => setShowBooking(false)} products={products} />
            <Return show={showReturn} close={e => setShowReturn(false)} products={products} />
            <footer className="app-footer">
                <Alert style={{ textAlign: "center" }} color="danger" isOpen={errorMsg ? true : false} toggle={() => setErrorMsg(null)}>
                    {errorMsg}
                </Alert>
                <ButtonGroup vertical={false}>
                    <Button className="main-button p-button-info" label="Book" icon="pi pi-check-circle" onClick={e => setShowBooking(true)} />
                    <Button className="main-button p-button-info" label="Return" icon="pi pi-replay" onClick={e => setShowReturn(true)} />
                </ButtonGroup>
            </footer>
        </div >
    );
};

export default Rental;
