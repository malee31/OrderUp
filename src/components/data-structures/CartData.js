import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * @typedef {Object} Item - An item on the menu
 * @property {string} item_id - ID of the item in the database
 * @property {string} name - Name of the item (Will be displayed)
 * @property {string} description - Description of the item (Will be displayed)
 */

/**
 * @typedef {Object & Item} CartItem - An item in the cart
 * @property {number} count - Number of the item in the cart. This is the only additional property in CartItem not in Item
 */

/**
 * @typedef {Object} CartData
 * @property {string} cartId - ID for the cart. Should be tied to a user in the future
 * @property {CartItem[]} items - Array of items in a cart and their counts
 */

/**
 * @typedef {Object & CartData} CartContextValue
 * @property {function} updateCart - Overwrites the current cart with the portion of data given to this function. Unspecified properties are unaffected
 * @property {function} addItem - Given an item object, the item is added to the cart with a count of 1 or the count is increased
 */

/** @type Context<CartContextValue>|Context<{}> */
const CartContext = createContext({});


/**
 * Allows read and write access to the current cart
 * @return {CartContextValue}
 */
export function useCart() {
	// noinspection JSCheckFunctionSignatures
	return useContext(CartContext);
}

export default function CartProvider({ children }) {
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

	const addItem = useCallback(item => {
		const cartItemClone = [...cart.items];
		const incrementItem = cartItemClone.find(cartItem => cartItem.item_id === item.item_id);
		if(incrementItem) {
			incrementItem.count++;
		} else {
			cartItemClone.push({
				...item,
				count: 1
			});
		}
		updateCart({ items: cartItemClone });
	}, [updateCart, cart.items]);

	const cartValue = useMemo(() => {
		return {
			...cart,
			addItem,
			updateCart
		};
	}, [cart, updateCart]);

	// Attempt to load cart from server
	useEffect(() => {
		console.log(`Attempt to fetch cart ${cartValue.cartId}`);
		fetch(`/cart/${cartValue.cartId}`)
			.then(res => res.json())
			.then(console.log);
	}, [cartValue.cartId]);

	return (
		<CartContext.Provider value={cartValue}>
			{children}
		</CartContext.Provider>
	);
}