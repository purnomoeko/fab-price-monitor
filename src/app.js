import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import Routing from './components/Routing';
import configureStore from './configureStore';
import './style/app.scss';

const store = configureStore({});
persistStore(store, {

}, () => {
    ReactDOM.render(
        <Provider store={store}>
            <Routing />
        </Provider>,
        document.getElementById('react'),
    );
});
