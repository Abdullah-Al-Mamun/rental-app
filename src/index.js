import React from 'react';
import ReactDOM from 'react-dom';
import ErrorBoundary from './components/Common/ErrorBoundary';
import TopPanel from './components/Layout/TopPanel';
import Rental from './pages/Rental';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './assets/css/App.css';

ReactDOM.render(
  <ErrorBoundary>
    <TopPanel title="Rental Information" />
    <Rental />
  </ErrorBoundary>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
