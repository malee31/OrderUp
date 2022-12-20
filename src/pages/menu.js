import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CartContext = createContext({});


export default function Menu() {
	const [cart, setCart] = useState({
		cartId: "DEMO",
		items: [],
		loaded: false
	});

	const updateCart = useCallback(updateSlice =>
		setCart(prevState => {
			return {
				...prevState,
				...updateSlice
			}
		}), [setCart]);

	const cartValue = useMemo(() => {
		return {
			...cart,
			updateCart
		};
	}, [cart, updateCart]);

	return (
		<CartContext.Provider value={cartValue}>
			<MenuView/>
		</CartContext.Provider>
	);
}

function MenuView() {
	const [menuItems, setMenuItems] = useState([
		{
			item_id: "kjdgf",
			name: "Cake",
			description: "Delicious cake"
		},
		{
			item_id: "asghdag",
			name: "Cake",
			description: "Delicious cake"
		},
	]);
	const [loading, setLoading] = useState(true);
	// TODO: Load in menu items

	return (
		<main className="w-full h-full px-8 py-8 overflow-y-auto bg-gray-100">
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
	const cart = useContext(CartContext);
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
		<div className="w-full max-w-[1000px] px-4 py-2 mx-auto my-2 rounded-md shadow-lg bg-white border-transparent border-2 transition-[border-color] hover:border-orange-200">
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
					className="px-2 py-1 absolute bottom-0 right-0 bg-orange-400 rounded"
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