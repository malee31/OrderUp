import { useEffect, useState } from "react";
import OrderEntry from "../components/Order/OrderEntry";

export default function Orders() {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		// console.log("Loading Orders");
		fetch("/order/list")
			.then(res => res.json())
			.then(res => setOrders(res["orders"]))
			.catch(err => {
				console.warn("Failed to Fetch Order List");
				console.error(err);
			});
	}, []);

	return (
		<main className="w-full h-full px-8 py-8 bg-gray-100 relative overflow-y-auto">
			<h1 className="text-center text-3xl">
				Current Orders
			</h1>
			<h2 className="text-center text-lg text-gray-500">
				A list of all currently placed orders
			</h2>
			<hr className="mt-2 mb-4"/>
			{orders.map(order => (
				<OrderEntry key={order.order_number} order={order}/>
			))}
		</main>
	);
}