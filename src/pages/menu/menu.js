import { useEffect, useState } from "react";
import CartProvider from "../../components/data-structures/CartData";
import CartSidebar from "../../components/Cart/CartSidebar";
import MenuItem from "../../components/Menu/MenuItem";
import MenuItemShimmer from "../../components/Menu/MenuItemShimmer";

export default function Menu() {
	return (
		<CartProvider>
			<MenuView/>
		</CartProvider>
	);
}

/**
 * Loads menu items to display from the server
 * TODO: Should load items from the database in the future (Optional: Retry when fail)
 * @async
 * @return {Item[]}
 */
async function loadItems() {
	return fetch("/menu/list")
		.then(res => res.json())
		.then(result => result.items);
}

function MenuView() {
	const [menuItems, setMenuItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showCart, setShowCart] = useState(false);
	useEffect(() => {
		loadItems()
			.then(items => {
				setMenuItems(items);
			})
			.catch(err => {
				console.warn("Failed to Load Menu Items");
				console.error(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<main className={`w-full h-full px-8 py-8 bg-gray-100 relative ${loading ? "overflow-y-hidden" : "overflow-y-auto"}`}>
			<h1 className="text-center text-3xl">
				Order From Our Extensive Menu
			</h1>
			<h2 className="text-center text-lg text-gray-500">
				A large variety of options for you to choose from
			</h2>
			<hr className="mt-2 mb-4"/>
			{/* Index as key is fine for silencing error here because order and count will never change */}
			{loading && Array(10).fill(0).map((x, index) => (
				<MenuItemShimmer key={index}/>
			))}
			{menuItems.map(item => (
				<MenuItem key={item.item_id} {...item}/>
			))}
			<CartSidebar show={showCart} setShow={setShowCart}/>
		</main>
	);
}