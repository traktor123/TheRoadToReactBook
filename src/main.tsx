import React from 'react'
import ReactDOM from 'react-dom/client'
import {App, App1}  from './App';
import './index.css'
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// ReactDOM.createRoot(document.getElementById('root1')!).render(
//   <React.StrictMode>
//     <App1 searchTerm=''/>
//   </React.StrictMode>,
// )
