import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { AppURL } from './Constant';
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import reducer from './reducer'
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure({ ...awsExports, ssr: true });

    axios.defaults.baseURL = AppURL;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
    
    const store = createStore(
      reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && 
      window.__REDUX_DEVTOOLS_EXTENSION__()
    )
    ReactDOM.render(
    
      <Provider store = {store}>
          <App />
       </Provider>, document.getElementById('root')
    );


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
