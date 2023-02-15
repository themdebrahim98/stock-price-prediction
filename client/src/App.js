import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import Training from "./Training";
import Prediction from "./Prediction";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import stcokImg from './media/stock.jpg'

function App() {
    return (
        <div className='App'  >
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/training' element={<Training />} />
                    <Route path='/prediction' element={<Prediction />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
