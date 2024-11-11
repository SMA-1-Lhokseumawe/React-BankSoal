import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

import './index.css';
import App from './App';
import axios from 'axios';
import { ContextProvider } from './contexts/ContextProvider';

axios.defaults.withCredentials = true;

ReactDOM.render(
        <Provider store={store}>
            <ContextProvider>
                <App />
            </ContextProvider>
        </Provider>,
    document.getElementById('root')
);