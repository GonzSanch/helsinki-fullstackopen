import React from 'react'
import ReactDOM from 'react-dom'

import store from './store'
import { Provider } from 'react-redux'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <App />
        </Provider>
    </Router>,
    document.getElementById('root')
)