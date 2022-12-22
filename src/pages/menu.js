import { useEffect, useState } from "react";
import CartProvider, { useCart } from "../components/data-structures/CartData";
import Cart from "../components/modal-like/Cart";

export default function Menu() {
	return (
		<CartProvider>
			<MenuView/>
		</CartProvider>
	);
}

/**
 * TODO: Should load items from the database in the future (Optional: Retry when fail)
 * @async
 * @return {Item[]}
 */
async function loadItems() {
	return await new Promise(resolve => {
		// 1 second timeout before returning test data for now
		setTimeout(() => {
			resolve([
				{
					item_id: "kjdgf",
					name: "Cake",
					description: "Delicious cake"
				},
				{
					item_id: "asghdag",
					name: "Cake",
					description: "Delicious cake"
				}
			]);
		}, 1000);
	})
}

function MenuView() {
	const [menuItems, setMenuItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showCart, setShowCart] = useState(false);
	// TODO: Load in menu items
	useEffect(() => {
		loadItems()
			.then(items => {
				setMenuItems(items);
				setLoading(false);
			})
	}, []);

	return (
		<main className="w-full h-full px-8 py-8 overflow-y-auto bg-gray-100 relative">
			<Cart show={showCart} setShow={setShowCart}/>
			<h1 className="text-center text-3xl">
				Order From Our Extensive Menu
			</h1>
			<h2 className="text-center text-lg text-gray-500">
				A large variety of options for you to choose from
			</h2>
			<hr className="mt-2 mb-4"/>
			{loading && <p className="text-center text-gray-500">Loading...</p>}
			{menuItems.map(item => (
				<MenuItem key={item.item_id} {...item}/>
			))}
		</main>
	);
}

function MenuItem({ name, item_id, description }) {
	const cart = useCart();

	const addItem = item => {
		const cartItemClone = [...cart.items];
		const increment = cartItemClone.find(cartItem => cartItem.item_id === item.item_id);
		if(increment) {
			increment.count++;
		} else {
			cartItemClone.push({
				...item,
				count: 1
			});
		}
		cart.updateCart({ items: cartItemClone });
	};

	return (
		<div className="w-full max-w-[1000px] px-4 py-2 mx-auto my-4 rounded-md shadow-md bg-slate-50 border-transparent border-2 transition-[box-shadow,background-color] hover:shadow-lg hover:bg-white">
			<h3 className="text-xl">{name}</h3>
			<hr/>
			<div className="w-100 min-h-[4rem] p-1 relative">
				<p className="inline-block">
					{description}
				</p>
				<div
					className="invisible inline-block px-2 py-1"
					aria-hidden={true}
				>
					{/* Used as a spacer for the button below */}
					Add to Cart
				</div>
				<button
					className="px-2 py-1 absolute bottom-0 right-0 bg-orange-300 rounded transition-[box-shadow] hover:shadow-md"
					onClick={() => addItem({
						item_id: item_id,
						name: name,
						description: description
					})}
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
}