import ReactDOM from 'react-dom/client'
import {App }  from './App';
import './index.css'
import './App.css';

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement)
  .render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
)

// ReactDOM.createRoot(document.getElementById('root1')!).render(
//   <React.StrictMode>
//     <App1 searchTerm=''/>
//   </React.StrictMode>,
// )
