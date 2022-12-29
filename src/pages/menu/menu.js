import { useEffect, useRef, useState } from "react";
import CartProvider, { useCart } from "../../components/data-structures/CartData";
import CartSidebar from "../../components/Cart/CartSidebar";

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
	return fetch("/menu/list").then(res => res.json()).then(result => result.items);
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
		<main className={`w-full h-full px-8 py-8 bg-gray-100 relative ${loading ? "overflow-y-hidden" : "overflow-y-auto"}`}>
			<h1 className="text-center text-3xl">
				Order From Our Extensive Menu
			</h1>
			<h2 className="text-center text-lg text-gray-500">
				A large variety of options for you to choose from
			</h2>
			<hr className="mt-2 mb-4"/>
			{/* Index as key is fine for silencing error here because order and count will never change */}
			{loading && Array(10).fill(0).map((x, index) => <MenuItemShimmer key={index}/>)}
			{menuItems.map(item => (
				<MenuItem key={item.item_id} {...item}/>
			))}
			<CartSidebar show={showCart} setShow={setShowCart}/>
		</main>
	);
}

function MenuItemShimmer() {
	const numFullSpanLines = useRef(Array(Math.floor(Math.random() * 2)).fill("Loading..."));
	const numRepeatLoadSpan = useRef(Array(Math.floor(Math.random() * 5 + (4 - 2 * numFullSpanLines.current.length))).fill("Loading..."));
	const titleWidth = useRef(Math.floor(Math.random() * 40 + 20));

	// Note: Render methods use indices as keys intentionally to silence the warning because the order does not matter and the state will not change
	return (
		<div
			aria-busy={true}
			aria-hidden={true}
			className="w-full max-w-[1000px] px-4 py-2 mx-auto my-4 rounded-md shadow-md bg-slate-50 border-transparent border-2 transition-[box-shadow,background-color] select-none"
		>
			<h3 className="animate-pulse bg-slate-200 text-transparent mb-1 text-xl" style={{width: `${titleWidth.current}%`}}>Loading...</h3>
			<div className="w-100 min-h-[4rem] p-1 relative">
				<p className="inline-block w-full">
					{numFullSpanLines.current.map((text, index) => (
						<span key={index} className="animate-pulse bg-slate-200 text-transparent mb-0.5 inline-block w-full">{text}</span>
					))}
					<span className="animate-pulse bg-slate-200 text-transparent mb-0.5 inline-block">{numRepeatLoadSpan.current.join(" ")}</span>

					{/* Used as a spacer for the actual "Add to Cart" button below */}
					<span
						className="invisible inline-block align-text-top mb-1 px-2 py-1"
						aria-hidden={true}
					>
						Add to Cart
					</span>
				</p>
				<button className="animate-pulse text-transparent px-2 py-1 absolute bottom-0 right-0 bg-orange-300 rounded">
					Add to Cart
				</button>
			</div>
		</div>
	);
}

function MenuItem({ name, item_id, description }) {
	const cart = useCart();

	return (
		<div className="w-full max-w-[1000px] px-4 py-2 mx-auto my-4 rounded-md shadow-md bg-slate-50 border-transparent border-2 transition-[box-shadow,background-color] hover:shadow-lg hover:bg-white">
			<h3 className="text-xl">{name}</h3>
			<hr/>
			<div className="w-100 min-h-[4rem] p-1 relative">
				<p className="inline-block">
					{description}

					{/* Used as a spacer for the actual "Add to Cart" button below */}
					<span
						className="invisible inline-block align-text-top mb-1 px-2 py-1"
						aria-hidden={true}
					>
						Add to Cart
					</span>
				</p>
				<button
					className="px-2 py-1 absolute bottom-0 right-0 bg-orange-300 rounded select-none transition-[box-shadow] hover:shadow-md"
					onClick={() => cart.addItem({
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