import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import CartProvider from "./components/data-structures/CartData";
import Nav from "./components/Nav";
import Home from "./pages/home";
import Menu from "./pages/menu/menu";
import MenuAdd from "./pages/menu/menu-add";
import Orders from "./pages/orders";
import Upload from "./pages/upload";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="" element={<><Nav/><Outlet/></>}>
			<Route exact path="/" element={<Home/>}/>
			<Route exact path="/home" element={<Home/>}/>
			<Route exact path="/menu" element={<Menu/>}/>
			<Route exact path="/menu/new" element={<MenuAdd/>}/>
			<Route exact path="/orders" element={<Orders/>}/>
			<Route exact path="/upload" element={<Upload/>}/>
			{/* TODO: Make 404 Page */}
			<Route exact path="*" element={<Home/>}/>
		</Route>
	)
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<CartProvider>
			<RouterProvider router={router}/>
		</CartProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
