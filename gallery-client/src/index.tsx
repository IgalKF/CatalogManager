import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { PDFDownloadLink, Document, Page as Pg } from '@react-pdf/renderer'

ReactDOM.render( 
    <React.StrictMode>
    <App />
    </ React.StrictMode>
    , document.getElementById('root')
);

reportWebVitals();