import React from 'react';
import { Link } from 'react-router-dom';

export default props => (
    <nav className="navbar navbar-default" id="header">
        <div className="container-fluid">
            <div className="navbar-header">
                <img src="https://fabelio.com/static/version1549893272/frontend/Fabelio/aurela/id_ID/images/fabelio_white_lamp.svg" alt="logo" style={{ height: 30 }} />
            </div>
            <ul className="nav navbar-nav">
                <li><Link to="/input-page">Input Page</Link></li>
                <li><Link to="/list">List Product</Link></li>
            </ul>
            <div className="pull-right"><Link to="/" className="app-title">Price Monitoring</Link></div>
        </div>
    </nav>
);