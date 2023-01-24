import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import Home from "./pages/home";
import Menu from "./pages/menu/menu";
import MenuAdd from "./pages/menu/menu-add";
import Orders from "./pages/orders";
import Upload from "./pages/upload";
import Nav from "./components/Nav";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Nav/>
			<Routes>
				<Route exact path="/" element={<Home/>}/>
				<Route exact path="/home" element={<Home/>}/>
				<Route exact path="/menu" element={<Menu/>}/>
				<Route exact path="/menu/add" element={<MenuAdd/>}/>
				<Route exact path="/orders" element={<Orders/>}/>
				<Route exact path="/upload" element={<Upload/>}/>
				{/* TODO: Make 404 Page */}
				<Route exact path="*" element={<Home/>}/>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
