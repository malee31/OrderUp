import { useState } from "react";
import CartSidebar from "../../components/Cart/CartSidebar";
import MenuItem from "../../components/Menu/MenuItem";
import MenuItemShimmer from "../../components/Menu/MenuItemShimmer";
import MenuProvider, { useMenu } from "../../components/data-structures/MenuData";

export default function Menu() {
	return (
		<MenuProvider>
			<MenuView/>
		</MenuProvider>
	);
}

function MenuView() {
	const [showCart, setShowCart] = useState(false);
	const menu = useMenu();
	const menuItems = menu.menuItems;
	const loading = !menu.loaded;

	return (
		<main className={`w-full h-full px-3 md:px-8 lg:px-20 xl:px-32 py-8 pt-20 bg-gray-100 relative ${loading ? "overflow-y-hidden" : "overflow-y-auto"}`}>
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